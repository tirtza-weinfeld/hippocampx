// import { db } from './query';
// import { topics, sections } from './schema';

// async function seed() {
//   try {
//     // Create the Hippocampus topic
//     const [hippocampusTopic] = await db
//       .insert(topics)
//       .values({
//         slug: 'hippocampus',
//         title: 'Hippocampus',
//         description: "Your brain's amazing memory center! Let's explore how it helps you learn and remember.",
//         metadata: {},
//       })
//       .returning();

//     // Create sections
//     await db.insert(sections).values([
//       {
//         topicId: hippocampusTopic.id,
//         slug: 'intro',
//         title: 'Meet Your Hippocampus',
//         description: "Your brain's memory superstar! This seahorse-shaped structure helps you learn and remember everything from your first day of school to what you had for breakfast.",
//         icon: 'Brain',
//         order: '1',
//         metadata: {},
//       },
//       {
//         topicId: hippocampusTopic.id,
//         slug: 'memory',
//         title: 'Memory Maker',
//         description: "The hippocampus is like a librarian for your brain, organizing and storing new memories. It helps you remember facts, events, and even how to ride a bike!",
//         icon: 'BookOpen',
//         order: '2',
//         metadata: {},
//       },
//       {
//         topicId: hippocampusTopic.id,
//         slug: 'learning',
//         title: 'Learning Powerhouse',
//         description: "Every time you learn something new, your hippocampus gets to work. It's especially active when you're learning new skills or studying for a test!",
//         icon: 'Sparkles',
//         order: '3',
//         metadata: {},
//       },
//       {
//         topicId: hippocampusTopic.id,
//         slug: 'fun',
//         title: 'Fun Facts',
//         description: "Did you know? The hippocampus is one of the few parts of the brain that can grow new neurons throughout your life! This is called neurogenesis.",
//         icon: 'Zap',
//         order: '4',
//         metadata: {},
//       },
//     ]);

//     console.log('✅ Database seeded successfully');
//   } catch (error) {
//     console.error('Error seeding database:', error);
//     process.exit(1);
//   }
// }

// seed(); 