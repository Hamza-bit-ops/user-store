export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Next.js MongoDB App</h1>
      <p className="text-gray-500">
        Welcome to the Next.js MongoDB integration example app. This application demonstrates 
        how to connect a Next.js application with MongoDB using Mongoose.
      </p>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Features:</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>App Router & API routes</li>
          <li>MongoDB integration with Mongoose</li>
          <li>TypeScript support</li>
          <li>Tailwind CSS for styling</li>
          <li>User CRUD operations</li>
        </ul>
      </div>
    </div>
  );
}
