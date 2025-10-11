// import { handlers } from "@/auth";
// export const { GET, POST } = handlers;

// app/api/auth/[...nextauth]/route.ts
// export const runtime = "nodejs"; // ensure Prisma runs on Node, not Edge
// export { handlers as GET, POST } from "@/auth";

// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth";

export const runtime = "nodejs"; // keep Prisma on Node, not Edge

export const { GET, POST } = handlers;
// or, if you prefer:
//// const { GET, POST } = handlers;
//// export { GET, POST };
