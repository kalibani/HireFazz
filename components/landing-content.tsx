'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import t from '@/locales/en/landing.json';

const testimonials = [
  {
    name: 'Bima',
    avatar: 'B',
    title: 'Talent Acquisition',
    description: 'Scan hundreds of CVs within minutes, absolutely game changer',
  },
  {
    name: 'Rachel',
    avatar: 'R',
    title: 'HeadHunter',
    description: 'This AI Assistant is Saving My Time So Much',
  },
  {
    name: 'Muhammad',
    avatar: 'M',
    title: 'HRD',
    description:
      'This app has changed my life, say goodbye to the tiring repetitive jobs!',
  },
  {
    name: 'Indra',
    avatar: 'I',
    title: 'HRD',
    description: 'Easy to use, super helpful CV scanner',
  },
];

export const LandingContent = () => {
  return (
    <div className="px-10 pb-20">
      <h2 className="text-center text-4xl text-white font-extrabold mb-10">
        {t.testimoni.title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {testimonials.map((item) => (
          <Card
            key={item.description}
            className="bg-[#192339] border-none text-white"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <div>
                  <p className="text-lg">{item.name}</p>
                  <p className="text-zinc-400 text-sm">{item.title}</p>
                </div>
              </CardTitle>
              <CardContent className="pt-4 px-0">
                {item.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};
