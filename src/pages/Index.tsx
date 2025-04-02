
import React from 'react';
import { TestEmailSender } from '@/components/TestEmailSender';

export default function Index() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">American Concrete Coatings</h1>
      <TestEmailSender />
    </div>
  );
}
