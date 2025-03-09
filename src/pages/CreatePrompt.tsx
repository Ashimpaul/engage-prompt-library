
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PromptForm from '../components/PromptForm';

const CreatePrompt = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create a New Prompt</h1>
          <p className="text-gray-600 mb-8">
            Share your prompt with the community. Great prompts are clear, useful, and include detailed usage instructions.
            The best prompts often include examples, guidelines, and specific applications to help others get the most value.
          </p>
          <PromptForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreatePrompt;
