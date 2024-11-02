import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-lg mb-8">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/" className=" hover:underline">
        <Button variant="link">Go back to Home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
