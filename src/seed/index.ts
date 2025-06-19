import { PrismaClient } from '@prisma/client';
import { IUserRequest } from '../interface/user.interface';

const prisma = new PrismaClient();

async function main() {
  const usersData: IUserRequest[] = [
    { user_name: 'user_1', password: 'pass123', role: 'USER' },
    { user_name: 'user_2', password: 'pass123', role: 'USER' },
    { user_name: 'user_3', password: 'pass123', role: 'USER' },
    { user_name: 'celebrity_1', password: 'pass123', role: 'CELEBRITY' },
    { user_name: 'celebrity_2', password: 'pass123', role: 'CELEBRITY' },
    { user_name: 'celebrity_3', password: 'pass123', role: 'CELEBRITY' },
  ];

  const users = await Promise.all(
    usersData.map(async (user) => {
      return prisma.user.create({
        data: {
          user_name: user.user_name,
          password: user.password,
          role: user.role,
          isSeeded: true,
        },
      });
    }),
  );

  const normalUsers = users.filter((u) => u.role === 'USER');
  const celebrityUsers = users.filter((u) => u.role === 'CELEBRITY');

  const followsData = [
    { followerId: normalUsers[0].id, followingId: celebrityUsers[0].id },
    { followerId: normalUsers[1].id, followingId: celebrityUsers[0].id },
    { followerId: normalUsers[1].id, followingId: celebrityUsers[1].id },
    { followerId: normalUsers[2].id, followingId: celebrityUsers[2].id },
    { followerId: normalUsers[0].id, followingId: celebrityUsers[2].id },
    { followerId: normalUsers[2].id, followingId: celebrityUsers[0].id },
  ];

  await prisma.follows.createMany({
    data: followsData,
    skipDuplicates: true,
  });

  const celebrities = users.filter((u) => u.role === 'CELEBRITY');

  let postCount = 0;
  const postPromises = [];

  while (postCount < 25) {
    for (const celeb of celebrities) {
      if (postCount >= 25) break;

      postPromises.push(
        prisma.post.create({
          data: {
            content: `This is post ${postCount + 1} by ${celeb.user_name}`,
            authorId: celeb.id,
          },
        }),
      );

      postCount++;
    }
  }

  await Promise.all(postPromises);

  console.log('✅ Seeding complete: 6 users, followers, and 25 posts.');
}

main()
  .catch((err) => {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
