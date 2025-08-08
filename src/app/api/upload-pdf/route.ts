// src/app/api/upload-pdf/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { OpenAIEmbeddings } from '@langchain/openai';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Load and split PDF
    const loader = new PDFLoader(new Blob([buffer]));
    const docs = await loader.load();
    
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    
    const splitDocs = await textSplitter.splitDocuments(docs);

    // Create embeddings and store in Supabase
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // Add user ID to metadata for each document
    const documentsWithUserId = splitDocs.map(doc => ({
      ...doc,
      metadata: {
        ...doc.metadata,
        userId,
        source: file.name,
      }
    }));

    await SupabaseVectorStore.fromDocuments(
      documentsWithUserId,
      embeddings,
      {
        client: supabase,
        tableName: 'documents',
        queryName: 'match_documents',
      }
    );

    return NextResponse.json({ 
      success: true, 
      message: 'PDF processed and stored successfully',
      documentCount: splitDocs.length
    });
  } catch (error) {
    console.error('Error processing PDF:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Could not find the table')) {
        return NextResponse.json({ 
          error: 'Database table not found. Please ensure the documents table is created in your Supabase database.' 
        }, { status: 500 });
      }
      
      if (error.message.includes('permission denied')) {
        return NextResponse.json({ 
          error: 'Permission denied. Please check your database permissions.' 
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({ error: 'Failed to process PDF' }, { status: 500 });
  }
}