export interface Term {
  term: string;
  definition: string;
  lesson?: { module: string; lesson: string };
}

export const glossary: Term[] = [
  { term: 'Algorithm', definition: 'A step-by-step set of instructions for solving a problem. AI models are built and trained using algorithms.' },
  { term: 'Artificial intelligence (AI)', definition: 'The field of building computer systems that perform tasks associated with human thinking, like recognizing images, understanding language, or making predictions.', lesson: { module: 'fundamentals', lesson: 'what-is-ai' } },
  { term: 'Artificial general intelligence (AGI)', definition: 'Hypothetical AI that could match humans across nearly all intellectual tasks. It does not exist today.', lesson: { module: 'fundamentals', lesson: 'what-is-ai' } },
  { term: 'Bias (in AI)', definition: 'Systematic errors that unfairly favor or disadvantage certain groups, often inherited from training data.', lesson: { module: 'ethics', lesson: 'bias-fairness' } },
  { term: 'Chatbot', definition: 'A program you talk with in natural language. Modern chatbots are usually powered by large language models.' },
  { term: 'Deep learning', definition: 'Machine learning that uses neural networks with many layers. It powers speech recognition, image recognition, and LLMs.', lesson: { module: 'fundamentals', lesson: 'what-is-ai' } },
  { term: 'Deepfake', definition: 'AI-generated image, audio, or video that realistically imitates a real person.', lesson: { module: 'ethics', lesson: 'privacy-deepfakes' } },
  { term: 'Feature', definition: 'A measurable property a model uses to make predictions, such as a word in an email or the color of a pixel.', lesson: { module: 'fundamentals', lesson: 'how-machines-learn' } },
  { term: 'Generative AI', definition: 'AI that creates new content (text, images, audio, video, or code) based on patterns learned from training data.', lesson: { module: 'fundamentals', lesson: 'what-is-ai' } },
  { term: 'Hallucination', definition: 'When an AI produces fluent, confident output that is false or made up, such as fake citations.', lesson: { module: 'fundamentals', lesson: 'neural-networks-llms' } },
  { term: 'Human in the loop', definition: 'A design where people review or approve AI outputs before they affect real decisions.', lesson: { module: 'ethics', lesson: 'bias-fairness' } },
  { term: 'Label', definition: 'The correct answer attached to a training example in supervised learning.', lesson: { module: 'fundamentals', lesson: 'how-machines-learn' } },
  { term: 'Large language model (LLM)', definition: 'A very large neural network trained on huge amounts of text to predict the next token. It is the engine behind chat assistants.', lesson: { module: 'fundamentals', lesson: 'neural-networks-llms' } },
  { term: 'Lateral reading', definition: 'Checking a claim by leaving the source and seeing what other trustworthy sources say about it.', lesson: { module: 'tools', lesson: 'study-and-verify' } },
  { term: 'Machine learning (ML)', definition: 'A branch of AI in which systems learn patterns from data instead of following only hand-written rules.', lesson: { module: 'fundamentals', lesson: 'how-machines-learn' } },
  { term: 'Model', definition: 'The trained system that makes predictions. It is the learned result of running an algorithm on data.' },
  { term: 'Neural network', definition: 'A model made of layers of connected units whose connection weights are adjusted during training.', lesson: { module: 'fundamentals', lesson: 'neural-networks-llms' } },
  { term: 'Overfitting', definition: 'When a model memorizes its training data and performs poorly on new data.', lesson: { module: 'fundamentals', lesson: 'how-machines-learn' } },
  { term: 'Prompt', definition: 'The instruction or question you give an AI system.', lesson: { module: 'tools', lesson: 'prompting' } },
  { term: 'Reinforcement learning', definition: 'Learning by trial and error, guided by rewards and penalties.', lesson: { module: 'fundamentals', lesson: 'how-machines-learn' } },
  { term: 'Supervised learning', definition: 'Learning from labeled examples to predict labels for new data.', lesson: { module: 'fundamentals', lesson: 'how-machines-learn' } },
  { term: 'Token', definition: 'A chunk of text (a word or part of a word) that a language model reads and predicts.', lesson: { module: 'fundamentals', lesson: 'neural-networks-llms' } },
  { term: 'Training data', definition: 'The examples a model learns from.', lesson: { module: 'fundamentals', lesson: 'how-machines-learn' } },
  { term: 'Unsupervised learning', definition: 'Finding structure, such as groups or clusters, in data that has no labels.', lesson: { module: 'fundamentals', lesson: 'how-machines-learn' } },
  { term: 'Weight', definition: 'A number in a neural network that controls how strongly one unit influences another. Weights are learned during training.', lesson: { module: 'fundamentals', lesson: 'neural-networks-llms' } },
];
