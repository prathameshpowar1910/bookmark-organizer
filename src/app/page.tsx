import { FC } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FaChrome, FaBookmark, FaReact } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import GetStartedButton from '@/components/component/GetStartedButton';

const AnimatedHeader = dynamic(() => import('@/components/component/AnimatedHeader'), { ssr: false });

const Home: FC = () => {
  return (
    <>
      <AnimatedHeader />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <FeatureCard
          icon={<FaChrome className="w-12 h-12 text-blue-500" />}
          title="Chrome Integration"
          description="Seamlessly import your Chrome bookmarks with just a few clicks"
        />
        <FeatureCard
          icon={<FaBookmark className="w-12 h-12 text-green-500" />}
          title="Smart Organization"
          description="Automatically categorize and tag your bookmarks for easy access"
        />
        <FeatureCard
          icon={<FaReact className="w-12 h-12 text-cyan-500" />}
          title="Modern Tech Stack"
          description="Built with Next.js, TypeScript, and shadcn/ui for a smooth experience"
        />
      </div>

      <div className="text-center">
        <GetStartedButton />
      </div>
    </>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default Home;