import React from 'react';
import type { Template } from '~/types/template';
import { STARTER_TEMPLATES } from '~/utils/constants';

interface FrameworkLinkProps {
  template: Template;
}

const FrameworkLink: React.FC<FrameworkLinkProps> = ({ template }) => (
  <a
    href={`/git?url=https://github.com/${template.githubRepo}.git`}
    data-state="closed"
    data-discover="true"
    className="items-center justify-center w-10 h-10 bg-bolt-elements-prompt-background rounded-[16px] flex"
  >
    <div
      className={`inline-block ${template.icon} w-5 h-5 text-4xl transition-theme hover:opacity-75 transition-all`}
    />
  </a>
);

const StarterTemplates: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-4 mb-10">
      <span className="text-sm text-gray-500">or continue from a blank project with your favorite stack</span>
      <div className="flex justify-center">
        <div className="flex w-80 flex-wrap items-center justify-center gap-4">
          {STARTER_TEMPLATES.map((template) => (
            <FrameworkLink key={template.name} template={template} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StarterTemplates;
