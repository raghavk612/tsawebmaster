import type { Module } from '../types';

export const tools: Module = {
  id: 'tools',
  number: 2,
  title: 'AI Tools & Techniques',
  tagline: 'Use AI like a skilled student, not a shortcut.',
  description:
    'Tour the AI toolbox, write prompts that get genuinely useful answers, and learn to fact-check AI before you trust it.',
  color: 'var(--m2)',
  lessons: [
    /* ------------------------------------------------------------ 2.1 */
    {
      id: 'ai-toolbox',
      title: 'The AI toolbox',
      summary: 'The main kinds of AI tools, what each is for, and how to pick the right one.',
      minutes: 8,
      sections: [
        {
          kind: 'text',
          heading: 'Not one tool, but many',
          body: [
            '"AI" isn’t one app. Different tools are built for different jobs, and choosing the right one is the first skill. Before using any tool for school, check two things: your teacher’s or school’s AI policy, and the tool’s age requirements. Many AI services require users to be at least 13, and some require parent permission until 18.',
          ],
        },
        {
          kind: 'list',
          heading: 'The main categories',
          items: [
            { term: 'Chat assistants (LLMs)', detail: 'Examples: ChatGPT, Claude, Gemini, Copilot. Good for explaining ideas, brainstorming, giving feedback on drafts, and practice questions.' },
            { term: 'AI-powered search & research', detail: 'Examples: search engines with AI summaries, Perplexity. Good for starting research, because they show links you can check. Always open the sources.' },
            { term: 'Image & media generators', detail: 'Examples: Adobe Firefly, DALL·E, Canva’s AI tools. Good for concept art, mockups, and presentation visuals. Label AI-generated images.' },
            { term: 'Speech & accessibility', detail: 'Examples: live captions, text-to-speech, dictation. Good for note-taking, accessibility, and language practice.' },
            { term: 'Coding assistants', detail: 'Examples: GitHub Copilot, AI features in code editors. Good for explaining errors and suggesting code. You still need to understand what you submit.' },
          ],
        },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Rule of thumb',
          body: 'Use AI to help you think, not to think for you. The best uses leave you understanding more than when you started.',
        },
        { kind: 'checkpoint', question: "You need current, checkable sources about a local news event. Which tool fits best?", choices: ["An image generator", "An AI search tool that links to its sources", "A chatbot with no web access"], answer: 1, explain: "Recent events need live sources, and links let you verify them." },
      ],
      activity: {
        type: 'sort',
        title: 'Match the task to the tool',
        instructions: 'Pick which kind of AI tool fits each student task best.',
        buckets: ['Chat assistant', 'AI search / research', 'Speech & accessibility'],
        items: [
          { text: 'Get photosynthesis explained three different ways until it clicks', bucket: 0, why: 'Chat assistants shine at re-explaining concepts at your level.' },
          { text: 'Find recent, linkable sources about microplastics', bucket: 1, why: 'Research tools show sources you can open and verify. Chatbots may invent citations.' },
          { text: 'Turn a recorded lecture into captions to review', bucket: 2, why: 'Speech-to-text tools create transcripts and captions.' },
          { text: 'Get feedback on the clarity of your essay’s thesis', bucket: 0, why: 'A chat assistant can critique your own writing without writing it for you.' },
          { text: 'Check what current news outlets say about a local election', bucket: 1, why: 'Recent events need live sources, and AI search links to them.' },
          { text: 'Have a reading assignment read aloud while you follow along', bucket: 2, why: 'Text-to-speech is an accessibility tool.' },
        ],
      },
      quiz: [
        {
          prompt: 'Before using an AI tool for a class assignment, you should first…',
          choices: [
            'Check your teacher’s AI policy and the tool’s age requirements',
            'Buy the premium version',
            'Turn off your Wi-Fi',
            'Ask the AI if it’s allowed',
          ],
          answer: 0,
          explain: 'Policies differ by class and school, and many tools have minimum ages or require parental consent.',
        },
        {
          prompt: 'Which tool type is best for finding sources you can verify?',
          choices: ['An image generator', 'AI-powered search that links to sources', 'A calculator', 'A text-to-speech app'],
          answer: 1,
          explain: 'Research tools with links let you open and check the original sources.',
        },
        {
          prompt: 'Which is the best "help you think" use of AI?',
          choices: [
            'Copying an AI-written essay',
            'Asking AI to quiz you on your notes before a test',
            'Having AI take an online test for you',
            'Pasting AI answers into homework without reading them',
          ],
          answer: 1,
          explain: 'Self-quizzing with AI builds your own understanding, which is exactly the goal.',
        },
      ],
    },

    /* ------------------------------------------------------------ 2.2 */
    {
      id: 'prompting',
      title: 'Prompting that works',
      summary: 'Role, task, context, format, constraints: the five parts of a strong prompt.',
      minutes: 10,
      sections: [
        {
          kind: 'text',
          heading: 'Why the prompt matters',
          body: [
            'A prompt is the instruction you give an AI. Vague prompts get generic answers. Clear, specific prompts get useful ones. Think of it as briefing a very capable tutor who knows nothing about you, your class, or your assignment.',
          ],
        },
        { kind: 'widget', widget: 'prompt-compare' },
        {
          kind: 'list',
          heading: 'The five building blocks',
          items: [
            { term: 'Role', detail: 'Who should the AI act as? "Act as a patient chemistry tutor."' },
            { term: 'Task', detail: 'What exactly do you want? "Quiz me on balancing equations."' },
            { term: 'Context', detail: 'What does it need to know? "I’m in 10th grade and I keep mixing up coefficients and subscripts."' },
            { term: 'Format', detail: 'How should the answer look? "One question at a time, and wait for my answer."' },
            { term: 'Constraints', detail: 'What should it avoid? "Don’t give me the answer until I try."' },
          ],
        },
        { kind: 'checkpoint', question: "What’s missing from this prompt: “Act as a coach. Make me a workout plan.”", choices: ["A role", "A task", "Context, like your age, goal, and equipment"], answer: 2, explain: "It has a role and a task, but without context the plan can’t fit you." },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'Iterate, don’t settle',
          body: 'Prompting is a conversation. If the first answer misses, say what to change: "Simpler, please", "Use a sports example", "That’s wrong: check step 2." Your follow-ups often matter more than your first prompt.',
        },
        {
          kind: 'callout',
          tone: 'warn',
          title: 'Never put private info in a prompt',
          body: 'Don’t paste passwords, your address, phone number, or other people’s personal details. Many services may store conversations and use them to improve their models.',
        },
      ],
      activity: {
        type: 'prompt-builder',
        title: 'Prompt makeover',
        instructions: 'Start from a weak prompt and add building blocks. Add only the ones that make it better. Some are traps!',
        base: 'Help me with the French Revolution.',
        parts: [
          { id: 'role', label: 'Role', text: 'Act as a history tutor for a 10th grader.', good: true, why: 'A role sets the level and tone of the help.' },
          { id: 'task', label: 'Task', text: 'Help me understand the three main causes of the French Revolution.', good: true, why: 'A specific task replaces a vague "help me".' },
          { id: 'context', label: 'Context', text: 'I have a quiz Friday and I get confused about the Estates system.', good: true, why: 'Context points the AI at what you actually need.' },
          { id: 'format', label: 'Format', text: 'Explain in a short bulleted list, then ask me 3 check-for-understanding questions.', good: true, why: 'Format makes the answer usable and turns it into active practice.' },
          { id: 'essay', label: 'Deliverable', text: 'Then write my 5-paragraph essay so I can turn it in.', good: false, why: 'Submitting AI-written work as your own usually violates academic integrity policies, and you learn nothing.' },
          { id: 'pii', label: 'About me', text: 'My name is Jordan Lee, I go to Lincoln High, my number is 555-0142.', good: false, why: 'Personal details add nothing to the answer and put your privacy at risk.' },
        ],
      },
      quiz: [
        {
          prompt: 'Which prompt will most likely get the most useful answer?',
          choices: [
            '"Explain math."',
            '"Act as a tutor. I’m in Algebra 1 and confused about slope. Explain it with a real-world example, then give me 2 practice problems."',
            '"Do my homework."',
            '"Tell me everything."',
          ],
          answer: 1,
          explain: 'It includes role, context, task, and format, so the AI knows exactly how to help.',
        },
        {
          prompt: 'The first answer is too advanced for you. The best next step is to…',
          choices: [
            'Give up on AI',
            'Ask a follow-up: "Explain it more simply, like I’m new to this."',
            'Copy it anyway',
            'Start a brand-new unrelated chat',
          ],
          answer: 1,
          explain: 'Iterating with specific feedback is the core prompting skill.',
        },
        {
          prompt: 'What should you NOT include in a prompt?',
          choices: ['The topic you’re studying', 'Your grade level', 'Your home address and phone number', 'The format you want'],
          answer: 2,
          explain: 'Personal identifying information doesn’t help the answer and may be stored by the service.',
        },
      ],
    },

    /* ------------------------------------------------------------ 2.3 */
    {
      id: 'study-and-verify',
      title: 'Studying with AI (and checking it)',
      summary: 'Turn AI into a study partner, and catch its mistakes before they cost you.',
      minutes: 10,
      sections: [
        {
          kind: 'text',
          heading: 'AI as a tutor, not a ghostwriter',
          body: [
            'Research on learning is clear on one point: you remember what you actively work to recall and explain. AI helps most when it makes you do that work, by quizzing you, asking you questions, or pointing out gaps in your reasoning.',
          ],
        },
        {
          kind: 'list',
          heading: 'Study moves that work',
          items: [
            { term: 'Self-quiz', detail: '"Here are my notes. Ask me 5 questions, one at a time, and tell me what I got wrong."' },
            { term: 'Socratic mode', detail: '"Don’t tell me the answer. Ask me guiding questions until I figure it out."' },
            { term: 'Explain it back', detail: '"I’ll explain osmosis in my own words. Point out anything I got wrong or left out."' },
            { term: 'Feedback, not rewrite', detail: '"Point out the three weakest parts of my argument. Don’t rewrite it."' },
          ],
        },
        { kind: 'checkpoint', question: "Which prompt keeps YOU doing the thinking?", choices: ["“Write my lab conclusion.”", "“Ask me questions that lead me to the conclusion, without giving it away.”", "“Summarize the chapter so I don’t have to read it.”"], answer: 1, explain: "Socratic prompts make you retrieve and reason, which is how learning sticks." },
        {
          kind: 'text',
          heading: 'Verify before you trust',
          body: [
            'Treat every AI answer as a claim to check. Professional fact-checkers use lateral reading: instead of judging a claim by how convincing it sounds, they open new tabs and see what trustworthy, independent sources say.',
            'Be especially careful with numbers, dates, names, quotes, and citations. Those are where hallucinations hide.',
          ],
        },
        { kind: 'checkpoint', question: "An AI cites “Smith (2019), Journal of Space Facts.” What should you do first?", choices: ["Copy it into your bibliography", "Search for the article to confirm it exists and says that", "Ask the AI if it’s sure"], answer: 1, explain: "Only the original source can confirm a citation. Asking the AI again can produce another confident guess." },
      ],
      activity: {
        type: 'spot',
        title: 'Spot the hallucination',
        instructions: 'An AI wrote this answer. Tap every sentence you think contains a factual error, then check your picks.',
        question: 'Prompt: "Give me a short summary of the Apollo 11 mission."',
        sentences: [
          { text: 'Apollo 11 launched from Kennedy Space Center in July 1969.', wrong: false, why: 'Correct: it launched on July 16, 1969.' },
          { text: 'Neil Armstrong and Buzz Aldrin walked on the Moon while Michael Collins orbited in the command module.', wrong: false, why: 'Correct: Collins stayed in lunar orbit in Columbia.' },
          { text: 'The lunar module was named "Falcon".', wrong: true, why: 'Wrong: Apollo 11’s lunar module was "Eagle". (Falcon flew on Apollo 15.) It sounds plausible, which is typical of hallucinations.' },
          { text: 'Armstrong’s first words on the surface were "That’s one small step for man, one giant leap for mankind."', wrong: false, why: 'Correct as widely quoted.' },
          { text: 'The astronauts stayed on the lunar surface for about two weeks.', wrong: true, why: 'Wrong: the lunar module was on the surface for about 21.5 hours, and the moonwalk lasted about 2.5 hours.' },
          { text: 'According to NASA historian Dr. Linda Parks’ 1994 book "Moonfall", the mission nearly failed twice.', wrong: true, why: 'A made-up source. Specific-sounding citations you can’t find anywhere are a classic hallucination.' },
        ],
      },
      quiz: [
        {
          prompt: 'Which AI study habit builds the most learning?',
          choices: [
            'Asking AI to write your study guide and never opening it',
            'Having AI quiz you and explain what you got wrong',
            'Copying AI summaries into your notes word-for-word',
            'Asking AI for the test answers',
          ],
          answer: 1,
          explain: 'Active recall with feedback is one of the most effective study techniques.',
        },
        {
          prompt: '"Lateral reading" means…',
          choices: [
            'Reading a page sideways',
            'Checking a claim by seeing what other trustworthy sources say',
            'Reading only the first line',
            'Trusting the most confident-sounding answer',
          ],
          answer: 1,
          explain: 'Fact-checkers leave the page to verify claims with independent sources.',
        },
        {
          prompt: 'Which part of an AI answer deserves the MOST double-checking?',
          choices: ['The greeting', 'Specific dates, names, numbers, and citations', 'The formatting', 'The font'],
          answer: 1,
          explain: 'Precise details are where hallucinations most often hide.',
        },
      ],
    },
  ],
};
