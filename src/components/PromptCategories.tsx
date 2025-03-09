
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Calendar, GraduationCap, BarChart, Code, Pencil } from 'lucide-react';
import { categories } from '../lib/data';

const iconMap: Record<string, React.ReactNode> = {
  'pencil': <Pencil className="h-5 w-5" />,
  'code': <Code className="h-5 w-5" />,
  'briefcase': <Briefcase className="h-5 w-5" />,
  'graduation-cap': <GraduationCap className="h-5 w-5" />,
  'calendar': <Calendar className="h-5 w-5" />,
  'bar-chart': <BarChart className="h-5 w-5" />,
};

const PromptCategories = () => {
  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="layout-container">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore prompts organized by topic to find exactly what you're looking for.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/browse?category=${encodeURIComponent(category.name)}`}
              className="animate-on-scroll hover-lift"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-white rounded-xl border border-gray-100 p-6 card-shadow h-full transition-all hover:border-primary/20">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center text-secondary">
                    {iconMap[category.icon]}
                  </div>
                  <span className="text-sm text-gray-500 font-medium">{category.promptCount} prompts</span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {category.name}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {category.description}
                </p>
                
                <div className="flex items-center text-primary">
                  <span className="font-medium">Explore</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromptCategories;
