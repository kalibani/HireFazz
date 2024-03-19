import { currentUser } from '@/lib/auth';
import prismadb from '@/lib/prismadb';
import z from 'zod';

const PayloadInviteUser = z.object({
  email: z.string().email(),
  roleId: z.string(),
});

export const inviteUser = async (
  payload: z.infer<typeof PayloadInviteUser>
) => {
  try {
    // ngeparse payload
    const safePayload = PayloadInviteUser.parse(payload);
    // get current user yang login
    const current = await currentUser();
    // ngecheck user yang di invite pny account atau enggk di berry
    const data = await prismadb.user.findUnique({
      where: { email: safePayload.email },
    });
    // ngeget current user untuk dapat orgId
    const currentData = await prismadb.user.findUnique({
      where: { email: current?.email || '' },
    });

    // kalau datanya ada
    if (data) {
      await prismadb.userOrganization.create({
        data: {
          organizationId: currentData?.organizationId || '',
          userId: data.id,
          roleId: safePayload.roleId,
        },
      });
    } else {
      // send email to user to create new user
      // token isi nya orgId yang di invite dan role id
    }
    return {
      message: 'successfully invite user',
    };
  } catch {
    return null;
  }
};
