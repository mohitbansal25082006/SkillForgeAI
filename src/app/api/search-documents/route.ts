import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { OpenAIEmbeddings } from '@langchain/openai';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
interface SearchResult {
content: string;
metadata: Record<string, unknown>;
score: number;
}
export async function POST(request: Request) {
try {
const { userId } = await auth();

if (!userId) {
return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
const { query } = await request.json();
if (!query) {
return NextResponse.json({ error: 'Query is required' }, { status: 400 });
}
// Create embeddings
const embeddings = new OpenAIEmbeddings({
openAIApiKey: process.env.OPENAI_API_KEY,
});
// Create vector store
const vectorStore = await SupabaseVectorStore.fromExistingIndex(
embeddings,
{
client: supabase,
tableName: 'documents',
queryName: 'match_documents',
}
);
// Create query embedding
const queryEmbedding = await embeddings.embedQuery(query);
// Search for similar documents with scores
const results = await vectorStore.similaritySearchVectorWithScore(queryEmbedding, 5);
// Filter results by user ID
const filteredResults = results.filter(([doc]) =>
doc.metadata.userId === userId
);
return NextResponse.json({
results: filteredResults.map(([doc, score]) => ({
content: doc.pageContent,
metadata: doc.metadata as Record<string, unknown>,
score: score as number
})) as SearchResult[]
});
} catch (error) {
console.error('Error searching documents:', error);

// Provide more specific error messages
if (error instanceof Error) {
if (error.message.includes('Could not find the function')) {
return NextResponse.json({
error: 'Database function not found. Please ensure the match_documents function is created in your Supabase database.'
}, { status: 500 });
}

if (error.message.includes('PGRST202')) {
return NextResponse.json({
error: 'Function signature mismatch. Please update the match_documents function in your Supabase database.'
}, { status: 500 });
}
}

return NextResponse.json({ error: 'Failed to search documents' }, { status: 500 });
}
}



