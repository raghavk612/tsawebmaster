export interface Reference {
  title: string;
  publisher: string;
  url: string;
  usedFor: string;
}

/** Research sources used to write lesson content. */
export const references: Reference[] = [
  { title: 'Five Big Ideas in AI', publisher: 'AI4K12 (AAAI & CSTA)', url: 'https://ai4k12.org/', usedFor: 'Module 1 structure: what K-12 students should know about AI' },
  { title: 'Elements of AI', publisher: 'University of Helsinki & MinnaLearn', url: 'https://www.elementsofai.com/', usedFor: 'Definitions of AI, machine learning, and neural networks' },
  { title: 'Machine Learning Crash Course', publisher: 'Google for Developers', url: 'https://developers.google.com/machine-learning/crash-course', usedFor: 'Training/testing, overfitting, classification, LLM basics' },
  { title: 'Guidance for Generative AI in Education and Research', publisher: 'UNESCO (2023)', url: 'https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research', usedFor: 'Age limits, privacy, and responsible student use' },
  { title: 'AI Guidance for Schools Toolkit', publisher: 'TeachAI', url: 'https://www.teachai.org/toolkit', usedFor: 'School AI policy framing in Modules 2 and 3' },
  { title: 'AI Risk Management Framework', publisher: 'NIST (2023)', url: 'https://www.nist.gov/itl/ai-risk-management-framework', usedFor: 'Fairness, human oversight, and trustworthy AI' },
  { title: 'Gender Shades', publisher: 'MIT Media Lab, J. Buolamwini & T. Gebru (2018)', url: 'https://www.media.mit.edu/projects/gender-shades/overview/', usedFor: 'Bias case study in Lesson 3.1' },
  { title: 'Amazon scraps secret AI recruiting tool that showed bias against women', publisher: 'Reuters (2018)', url: 'https://www.reuters.com/article/us-amazon-com-jobs-automation-insight-idUSKCN1MK08G', usedFor: 'Hiring bias case study in Lesson 3.1' },
  { title: 'How do I cite generative AI in MLA style?', publisher: 'MLA Style Center', url: 'https://style.mla.org/citing-generative-ai/', usedFor: 'Citing AI in Lesson 3.2' },
  { title: 'How to cite ChatGPT', publisher: 'APA Style Blog', url: 'https://apastyle.apa.org/blog/how-to-cite-chatgpt', usedFor: 'Citing AI in Lesson 3.2' },
  { title: 'Civic Online Reasoning: Intro to Lateral Reading', publisher: 'Digital Inquiry Group', url: 'https://cor.inquirygroup.org/', usedFor: 'Fact-checking strategies in Lesson 2.3' },
  { title: 'Apollo 11 mission overview', publisher: 'NASA', url: 'https://www.nasa.gov/mission/apollo-11/', usedFor: 'Fact-checking the "Spot the hallucination" activity' },
];

export interface Asset {
  item: string;
  source: string;
  license: string;
  url: string;
}

/** Every third-party asset used on the site (for the copyright checklist). */
export const assets: Asset[] = [
  { item: 'Lucide icons', source: 'Lucide contributors', license: 'ISC License', url: 'https://lucide.dev/license' },
  { item: 'Bricolage Grotesque (heading font)', source: 'Mathieu Triay, via Google Fonts / Fontsource', license: 'SIL Open Font License 1.1', url: 'https://fonts.google.com/specimen/Bricolage+Grotesque' },
  { item: 'Atkinson Hyperlegible (body font)', source: 'Braille Institute, via Google Fonts / Fontsource', license: 'SIL Open Font License 1.1', url: 'https://fonts.google.com/specimen/Atkinson+Hyperlegible' },
  { item: 'React, React Router, Vite', source: 'Meta, Remix, Vite contributors', license: 'MIT License', url: 'https://github.com/facebook/react/blob/main/LICENSE' },
  { item: 'Illustrations, diagrams & logo', source: 'Original work by our team (hand-coded SVG)', license: 'Original, no permission needed', url: '' },
  { item: 'All lesson text, quizzes & activities', source: 'Original work by our team, researched from the sources listed above', license: 'Original, no permission needed', url: '' },
];
