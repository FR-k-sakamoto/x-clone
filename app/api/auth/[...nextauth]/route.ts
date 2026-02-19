import NextAuth from "next-auth";

import { authOptions } from "@/app/_infrastructure/auth/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

