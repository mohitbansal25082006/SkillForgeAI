import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

interface Week {
  week: number;
  title: string;
  description: string;
  modules: Module[];
}

interface Module {
  title: string;
  description: string;
  resources: Resource[];
  project: string;
}

interface Resource {
  type: string;
  title: string;
  url: string;
}

export async function createNotionPage(title: string, content: { description: string; weeks: Week[] }) {
  try {
    const response = await notion.pages.create({
      parent: {
        type: "database_id",
        database_id: process.env.NOTION_DATABASE_ID!,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        "Created Date": {
          date: {
            start: new Date().toISOString(),
          },
        },
        Status: {
          select: {
            name: "Active",
          },
        },
      },
      children: [
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [
              {
                text: {
                  content: title,
                },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                text: {
                  content: content.description || '',
                },
              },
            ],
          },
        },
        ...content.weeks.map((week) => ({
          object: 'block' as const,
          type: 'heading_2' as const,
          heading_2: {
            rich_text: [
              {
                text: {
                  content: `Week ${week.week}: ${week.title}`,
                },
              },
            ],
          },
        })),
        ...content.weeks.flatMap((week) => 
          week.modules.map((module) => [
            {
              object: 'block' as const,
              type: 'heading_3' as const,
              heading_3: {
                rich_text: [
                  {
                    text: {
                      content: module.title,
                    },
                  },
                ],
              },
            },
            {
              object: 'block' as const,
              type: 'paragraph' as const,
              paragraph: {
                rich_text: [
                  {
                    text: {
                      content: module.description,
                    },
                  },
                ],
              },
            },
          ])
        ).flat(),
      ],
    });

    return response;
  } catch (error) {
    console.error('Error creating Notion page:', error);
    throw error;
  }
}