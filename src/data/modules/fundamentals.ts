import type { Module } from '../types';

export const fundamentals: Module = {
  id: 'fundamentals',
  number: 1,
  title: 'How AI Works',
  tagline: 'Pop the hood on the technology everyone is talking about.',
  description:
    'Learn what artificial intelligence actually is, how machines learn from data, and why chatbots can write essays but still make things up.',
  color: 'var(--m1)',
  lessons: [
    /* ------------------------------------------------------------ 1.1 */
    {
      id: 'what-is-ai',
      title: 'What counts as AI?',
      summary: 'Definitions, the AI family tree, and the AI you already use every day.',
      minutes: 8,
      sections: [
        {
          kind: 'text',
          heading: 'A working definition',
          body: [
            'Artificial intelligence (AI) is the field of building computer systems that do tasks we normally associate with human thinking: recognizing images, understanding language, making predictions, or deciding what to do next.',
            'The key idea is that an AI system is not given a step-by-step rule for every situation. Instead, it finds patterns, usually by learning from examples, and uses those patterns to handle inputs it has never seen before.',
          ],
        },
        {
          kind: 'compare',
          heading: 'Regular program vs. AI system',
          columns: [
            {
              title: 'Traditional program',
              points: [
                'A person writes every rule: "if temperature < 68, turn on heat".',
                'Same input always gives the same output.',
                'Breaks when it meets a situation nobody wrote a rule for.',
              ],
            },
            {
              title: 'Machine-learning system',
              points: [
                'Learns rules from thousands of examples, like labeled photos.',
                'Outputs are predictions with some probability of being wrong.',
                'Can generalize to new cases, but only as well as its data allows.',
              ],
            },
          ],
        },
        { kind: 'checkpoint', question: "A thermostat turns on the heat whenever the room drops below 68°F. Is that AI?", choices: ["Yes, it makes a decision on its own", "No, it follows one fixed rule a person wrote", "Only if it has Wi-Fi"], answer: 1, explain: "No learning from data is happening; a person wrote the rule. A “smart” thermostat that learns your schedule over time would be using AI." },
        {
          kind: 'callout',
          tone: 'fact',
          title: 'Narrow, not general',
          body: 'Every AI system that exists today is "narrow AI": it is good at a specific range of tasks. A chess engine cannot drive a car. "Artificial general intelligence" (AGI), meaning AI that matches people across nearly every task, is a research goal and a topic of debate, not a product you can use.',
        },
        { kind: 'widget', widget: 'family-tree' },
      ],
      activity: {
        type: 'sort',
        title: 'AI or not AI?',
        instructions: 'Decide whether each technology learns patterns from data (AI) or just follows fixed rules someone wrote (Not AI).',
        buckets: ['AI', 'Not AI'],
        items: [
          { text: 'An email spam filter that improves as people mark messages as spam', bucket: 0, why: 'It learns which words and senders signal spam from millions of labeled examples.' },
          { text: 'A calculator app adding 2 + 2', bucket: 1, why: 'Arithmetic follows exact rules. Nothing is learned.' },
          { text: 'Your phone recognizing your face to unlock', bucket: 0, why: 'Face recognition uses a neural network trained on face images.' },
          { text: 'A microwave that stops after 90 seconds', bucket: 1, why: 'A timer is a fixed rule set by a person.' },
          { text: 'A streaming app recommending your next show', bucket: 0, why: 'Recommenders predict what you will like from your history and other viewers’ patterns.' },
          { text: 'A traffic light that changes every 45 seconds', bucket: 1, why: 'Fixed timing. (Some "smart" signals do use AI, but a simple timer does not.)' },
        ],
      },
      quiz: [
        {
          prompt: 'What most separates a machine-learning system from a traditional program?',
          choices: [
            'It runs faster',
            'It learns patterns from examples instead of following only hand-written rules',
            'It always gives the correct answer',
            'It needs no electricity',
          ],
          answer: 1,
          explain: 'ML systems infer their own rules from data. That lets them generalize, but it also means they can be wrong.',
        },
        {
          prompt: 'Which statement about today’s AI is accurate?',
          choices: [
            'Today’s AI systems are general intelligence that can do any task',
            'All AI uses hand-written if/then rules',
            'Current AI systems are "narrow": strong at specific kinds of tasks',
            'AI only exists in robots',
          ],
          answer: 2,
          explain: 'Existing systems are narrow AI. AGI remains a research goal.',
        },
        {
          prompt: 'Generative AI is best described as…',
          choices: [
            'AI that creates new content like text, images, or code',
            'Any computer that generates electricity',
            'A type of calculator',
            'AI that only sorts data into categories',
          ],
          answer: 0,
          explain: 'Generative models produce new content based on patterns learned from huge training sets.',
        },
      ],
    },

    /* ------------------------------------------------------------ 1.2 */
    {
      id: 'how-machines-learn',
      title: 'How machines learn',
      summary: 'Data, labels, training and testing: the recipe behind machine learning.',
      minutes: 10,
      sections: [
        {
          kind: 'text',
          heading: 'Learning = finding patterns in data',
          body: [
            'Imagine teaching a friend to tell ripe avocados from unripe ones. You would show them lots of examples and say "ripe" or "not ripe". Machine learning works the same way, just with far more examples and math instead of intuition.',
            'The examples are called training data. The answers attached to them ("ripe", "spam", "cat") are labels. The measurable details the model looks at, like color, firmness, or which words appear, are called features.',
          ],
        },
        { kind: 'checkpoint', question: "In a spam filter, the words in each email are the ___, and “spam / not spam” is the ___.", choices: ["labels / features", "features / labels", "weights / tokens"], answer: 1, explain: "Features are what the model looks at; labels are the answers it learns to predict." },
        {
          kind: 'list',
          heading: 'Three main ways machines learn',
          items: [
            { term: 'Supervised learning', detail: 'Learns from labeled examples. Used for spam filters, medical image screening, and grading handwriting.' },
            { term: 'Unsupervised learning', detail: 'Finds groups or structure in unlabeled data, like clustering shoppers with similar habits.' },
            { term: 'Reinforcement learning', detail: 'Learns by trial and error with rewards. Used for game-playing AI and robot control, and to help tune chatbots using human feedback.' },
          ],
        },
        {
          kind: 'text',
          heading: 'Training vs. testing',
          body: [
            'A model is trained on one set of examples and tested on a separate set it has never seen. That test score tells us how well it generalizes. A model that memorizes its training data but fails on new data is overfitting, like a student who memorized the practice test answers but never understood the material.',
          ],
        },
        { kind: 'widget', widget: 'threshold' },
        {
          kind: 'callout',
          tone: 'warn',
          title: 'Garbage in, garbage out',
          body: 'A model can only be as good as its data. If the training examples are mislabeled, too few, or unrepresentative, the model learns the wrong lessons. You will see this for yourself in the activity below.',
        },
        { kind: 'checkpoint', question: "A model scores 100% on its training data but only 60% on new data. What’s most likely happening?", choices: ["It’s overfitting: it memorized instead of learning", "It’s perfect", "The new data must be broken"], answer: 0, explain: "Big gaps between training and test scores are the classic sign of overfitting." },
      ],
      activity: {
        type: 'train-spam',
        title: 'Train a spam detector',
        instructions: 'Label each training message as Spam or Not spam. Your labels become the training data. Then watch your model predict messages it has never seen.',
        training: [
          { text: 'WIN a FREE iPhone!! Click now to claim your prize', spam: true },
          { text: 'Can you send me the chem lab notes from today?', spam: false },
          { text: 'URGENT: your account is locked, click here to verify', spam: true },
          { text: 'Practice moved to 4pm, bring your cleats', spam: false },
          { text: 'Congratulations, you won a free gift card, claim now', spam: true },
          { text: 'Mom says dinner is at 6, can you pick up bread?', spam: false },
          { text: 'Cheap followers FREE trial, click the link', spam: true },
          { text: 'Here are the notes for the history project', spam: false },
        ],
        test: [
          { text: 'Claim your FREE prize now, click to win', spam: true },
          { text: 'Can you bring the project notes to practice?', spam: false },
          { text: 'You won! Click here, urgent', spam: true },
          { text: 'Dinner at 6, bring the chem notes', spam: false },
        ],
      },
      quiz: [
        {
          prompt: 'In supervised learning, what is a "label"?',
          choices: [
            'The brand name of the computer',
            'The correct answer attached to a training example',
            'A sticker on the dataset',
            'The name of the programmer',
          ],
          answer: 1,
          explain: 'Labels are the known answers ("spam", "not spam") that the model learns to predict.',
        },
        {
          prompt: 'Why do we test a model on data it has never seen?',
          choices: [
            'To save storage space',
            'To check whether it generalizes instead of just memorizing',
            'Because training data is secret',
            'Testing is not necessary',
          ],
          answer: 1,
          explain: 'A separate test set reveals overfitting, where a model memorizes rather than learns.',
        },
        {
          prompt: 'An AI that learns to play a video game by getting points for good moves uses…',
          choices: ['Unsupervised learning', 'Supervised learning', 'Reinforcement learning', 'No learning at all'],
          answer: 2,
          explain: 'Reinforcement learning improves through trial, error, and rewards.',
        },
      ],
    },

    /* ------------------------------------------------------------ 1.3 */
    {
      id: 'neural-networks-llms',
      title: 'Neural networks & chatbots',
      summary: 'How large language models predict text, and why they sometimes make things up.',
      minutes: 12,
      sections: [
        {
          kind: 'text',
          heading: 'Neural networks in one minute',
          body: [
            'A neural network is a math function loosely inspired by brain cells. It is made of layers of simple units ("neurons"). Each connection has a weight, which is a number saying how much one unit influences the next.',
            'Training adjusts millions or billions of these weights, a little at a time, so the network’s outputs get closer to the right answers. No one programs the weights by hand. They are learned from data.',
          ],
        },
        { kind: 'widget', widget: 'neuron' },
        {
          kind: 'text',
          heading: 'Large language models (LLMs)',
          body: [
            'Chatbots like ChatGPT, Claude, and Gemini are built on large language models. An LLM is trained on enormous amounts of text to do one core task: predict the next token. A token is a word or piece of a word.',
            'Given "The capital of France is", the model assigns a probability to every possible next token, picks one, adds it, and repeats. After further training with human feedback, this simple loop produces answers that can explain, summarize, translate, and write code.',
          ],
        },
        { kind: 'widget', widget: 'temperature' },
        {
          kind: 'callout',
          tone: 'warn',
          title: 'Why chatbots "hallucinate"',
          body: 'Because an LLM generates what is statistically likely, not what it has checked, it can produce confident, fluent statements that are false: fake quotes, wrong dates, even citations to books that don’t exist. This is called a hallucination. Fluency is not the same as accuracy.',
        },
        {
          kind: 'list',
          heading: 'What LLMs are good and bad at',
          items: [
            { term: 'Usually strong', detail: 'Explaining concepts in different ways, brainstorming, summarizing text you give them, drafting and editing, and simple coding help.' },
            { term: 'Often weak', detail: 'Exact facts and citations, very recent events, precise math without tools, and knowing when they don’t know.' },
          ],
        },
        { kind: 'checkpoint', question: "Why can a chatbot state a fake fact so confidently?", choices: ["It is lying on purpose", "It generates likely-sounding text instead of checking facts", "Its Wi-Fi is slow"], answer: 1, explain: "LLMs predict plausible next tokens. Nothing in that loop checks whether the result is true." },
      ],
      activity: {
        type: 'next-token',
        title: 'Think like a language model',
        instructions: 'For each sentence, pick the word you think a language model would rate most likely to come next. Then see the (illustrative) probabilities.',
        rounds: [
          {
            context: 'Peanut butter and ___',
            options: [
              { word: 'jelly', p: 0.72 },
              { word: 'bananas', p: 0.12 },
              { word: 'honey', p: 0.1 },
              { word: 'pickles', p: 0.06 },
            ],
          },
          {
            context: 'The first person to walk on the Moon was Neil ___',
            options: [
              { word: 'Armstrong', p: 0.93 },
              { word: 'Young', p: 0.03 },
              { word: 'deGrasse', p: 0.02 },
              { word: 'Gaiman', p: 0.02 },
            ],
          },
          {
            context: 'My favorite subject in school is ___',
            options: [
              { word: 'math', p: 0.31 },
              { word: 'science', p: 0.28 },
              { word: 'history', p: 0.22 },
              { word: 'lunch', p: 0.19 },
            ],
          },
        ],
      },
      quiz: [
        {
          prompt: 'At its core, what is a large language model trained to do?',
          choices: [
            'Search the internet for each answer',
            'Predict the next token in a sequence of text',
            'Look up answers in an encyclopedia',
            'Copy and paste whole web pages',
          ],
          answer: 1,
          explain: 'LLMs generate text one token at a time by predicting what is likely to come next.',
        },
        {
          prompt: 'A chatbot confidently cites a research paper that doesn’t exist. This is called…',
          choices: ['A hallucination', 'Overclocking', 'Encryption', 'A firewall'],
          answer: 0,
          explain: 'Hallucinations are fluent but false outputs. Always verify facts and citations.',
        },
        {
          prompt: 'In a neural network, what changes during training?',
          choices: [
            'The computer’s hardware',
            'The weights on the connections between neurons',
            'The alphabet',
            'Nothing, since networks are programmed by hand',
          ],
          answer: 1,
          explain: 'Training nudges the weights so the network’s outputs get closer to correct answers.',
        },
      ],
    },
  ],
};
