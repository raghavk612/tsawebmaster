import type { Module } from '../types';

export const ethics: Module = {
  id: 'ethics',
  number: 3,
  title: 'Using AI Ethically',
  tagline: 'Power comes with responsibility, including yours.',
  description:
    'Explore bias and fairness, academic integrity, privacy, and deepfakes, and practice making the call in real school situations.',
  color: 'var(--m3)',
  lessons: [
    /* ------------------------------------------------------------ 3.1 */
    {
      id: 'bias-fairness',
      title: 'Bias & fairness',
      summary: 'How AI can learn unfair patterns, and what people do about it.',
      minutes: 10,
      sections: [
        {
          kind: 'text',
          heading: 'Where AI bias comes from',
          body: [
            'AI learns from data created by people, and that data reflects our world, including its unfairness. If a dataset under-represents some groups or records past discrimination, a model trained on it can repeat or even amplify those patterns at huge scale.',
          ],
        },
        { kind: 'widget', widget: 'bias' },
        {
          kind: 'list',
          heading: 'Real examples researchers documented',
          items: [
            { term: 'Face analysis', detail: 'The 2018 "Gender Shades" study by Joy Buolamwini and Timnit Gebru found commercial gender-classification systems were far less accurate for darker-skinned women than for lighter-skinned men.' },
            { term: 'Hiring', detail: 'Reuters reported in 2018 that Amazon abandoned an experimental résumé-screening tool after finding it downgraded résumés containing the word "women’s", a pattern learned from a decade of male-dominated hiring data.' },
            { term: 'Image generators', detail: 'Studies of text-to-image models have found they often default to stereotypes, for example picturing "CEO" or "engineer" mostly as men.' },
          ],
        },
        { kind: 'checkpoint', question: "In the simulator, what closed the accuracy gap?", choices: ["Making the model bigger", "Including more Group B photos in the training data", "Adding a dark mode"], answer: 1, explain: "Representative data is one of the most important fixes, along with testing every group separately." },
        {
          kind: 'callout',
          tone: 'tip',
          title: 'What you can do',
          body: 'Notice who is missing from AI outputs. Ask for diverse examples on purpose. Question automated decisions that affect people, and remember that "the computer said so" is not a reason by itself.',
        },
      ],
      activity: {
        type: 'scenario',
        title: 'Fair or not?',
        instructions: 'Read each situation and choose the most responsible response.',
        scenarios: [
          {
            situation: 'Your club uses an AI image generator for a "Future Scientists" poster. Every scientist it creates is a white man in a lab coat.',
            options: [
              { text: 'Use it anyway. The AI knows what scientists look like.', best: false, feedback: 'The output reflects biased training data, not reality, and it may tell some students science isn’t for them.' },
              { text: 'Rewrite the prompt to ask for scientists of different genders, ethnicities, and fields, and review the results.', best: true, feedback: 'Yes. You noticed the bias and steered the tool, and you still stay the final reviewer.' },
              { text: 'Never use AI for anything again.', best: false, feedback: 'Avoiding the tool entirely isn’t necessary. Awareness and correction are.' },
            ],
          },
          {
            situation: 'A school is considering an AI tool that predicts which students might fail a class, based only on past grades from previous years.',
            options: [
              { text: 'Adopt it immediately. Data doesn’t lie.', best: false, feedback: 'Historical data can carry past unfairness, and predictions can become self-fulfilling labels.' },
              { text: 'Ask how it was tested for fairness across student groups, and make sure teachers, not the AI, make the final decisions.', best: true, feedback: 'Exactly. Human oversight and fairness testing are core principles in frameworks like NIST’s AI Risk Management Framework.' },
              { text: 'Let the AI publish a ranked list of students.', best: false, feedback: 'That harms privacy and could stigmatize students based on a prediction.' },
            ],
          },
        ],
      },
      quiz: [
        {
          prompt: 'The most common root cause of AI bias is…',
          choices: [
            'Computers being intentionally mean',
            'Training data that under-represents groups or reflects past unfairness',
            'Too much electricity',
            'Using a dark-mode screen',
          ],
          answer: 1,
          explain: 'Models learn patterns in their data, including unfair ones.',
        },
        {
          prompt: 'What did the "Gender Shades" study show?',
          choices: [
            'Face-analysis systems were equally accurate for everyone',
            'Commercial systems were much less accurate for darker-skinned women',
            'AI cannot see color',
            'Only humans are biased',
          ],
          answer: 1,
          explain: 'The study revealed large accuracy gaps across gender and skin type.',
        },
        {
          prompt: 'Which is a good safeguard when AI helps make decisions about people?',
          choices: [
            'Removing all human review',
            'Keeping a human in the loop and testing for fairness',
            'Hiding how the system works',
            'Using as little data as possible without checking it',
          ],
          answer: 1,
          explain: 'Human oversight plus fairness testing catches problems before they hurt people.',
        },
      ],
    },

    /* ------------------------------------------------------------ 3.2 */
    {
      id: 'academic-integrity',
      title: 'Academic integrity',
      summary: 'Where the lines are, how to disclose AI use, and how to cite it.',
      minutes: 9,
      sections: [
        {
          kind: 'text',
          heading: 'The policy is the rule',
          body: [
            'There is no single rule for AI in school. One teacher may encourage AI brainstorming while another bans AI on an assignment entirely. Your class’s policy always comes first. When it’s unclear, ask before you use AI, not after.',
          ],
        },
        { kind: 'checkpoint', question: "Your history teacher allows AI brainstorming, but your English teacher bans AI. Can you use AI to brainstorm your English essay?", choices: ["Yes, one teacher allowed it", "No, the English class policy applies", "Only if nobody finds out"], answer: 1, explain: "Each class’s policy governs its own work." },
        {
          kind: 'compare',
          heading: 'A common way to think about it',
          columns: [
            { title: 'Usually OK', points: ['Explaining a concept you’re stuck on', 'Quizzing yourself', 'Brainstorming topics you then research', 'Checking grammar on your own writing'] },
            { title: 'Ask first', points: ['AI feedback on a graded draft', 'Using AI to outline an essay', 'AI-generated images in a project', 'Help debugging code for a graded assignment'] },
            { title: 'Not OK', points: ['Submitting AI-written work as your own', 'Using AI during a closed test', 'Making up sources', 'Hiding AI use when disclosure is required'] },
          ],
        },
        {
          kind: 'list',
          heading: 'Disclose and cite',
          items: [
            { term: 'Disclose', detail: 'Add a short note: "I used Claude to brainstorm topics and to quiz me on sources. All writing is my own."' },
            { term: 'Cite', detail: 'MLA and APA both publish guidance for citing generative AI. Usually you name the tool, the company, the date, and a description of your prompt.' },
            { term: 'Keep a trail', detail: 'Save your chats and drafts. If anyone asks, you can show your process.' },
          ],
        },
      ],
      activity: {
        type: 'sort',
        title: 'OK, ask first, or not OK?',
        instructions: 'Sort each use of AI using a typical school policy. Your own teacher’s policy always wins!',
        buckets: ['Usually OK', 'Ask first', 'Not OK'],
        items: [
          { text: 'Asking AI to explain mitosis a different way after reading the textbook', bucket: 0, why: 'Using AI as a tutor to understand material is widely accepted.' },
          { text: 'Pasting an AI-written lab report in as your own', bucket: 2, why: 'Presenting AI work as your own is plagiarism under nearly every policy.' },
          { text: 'Using AI to outline your argumentative essay', bucket: 1, why: 'Some teachers allow it and some don’t. It shapes your thinking on graded work, so ask.' },
          { text: 'Having AI generate practice questions from your notes', bucket: 0, why: 'Self-quizzing supports your learning.' },
          { text: 'Using a chatbot on your phone during a closed-book test', bucket: 2, why: 'That’s cheating, whether it’s AI or a friend.' },
          { text: 'Adding AI-generated images to a history presentation', bucket: 1, why: 'Often fine if labeled, but check expectations and credit the tool.' },
        ],
      },
      quiz: [
        {
          prompt: 'Two teachers have different AI policies. Which applies to your English essay?',
          choices: ['The stricter one', 'The looser one', 'Your English teacher’s policy', 'Whatever the AI says'],
          answer: 2,
          explain: 'Each class’s policy governs its own assignments. When unclear, ask.',
        },
        {
          prompt: 'What’s the best way to handle allowed AI help on an assignment?',
          choices: ['Hide it', 'Disclose how you used it and cite the tool', 'Delete your chat history', 'Only use it at night'],
          answer: 1,
          explain: 'Transparency builds trust, and many teachers require disclosure.',
        },
        {
          prompt: 'Which use is almost always an academic integrity violation?',
          choices: [
            'Asking AI to explain a hard concept',
            'Submitting AI-written work as your own',
            'Quizzing yourself with AI',
            'Checking your own grammar',
          ],
          answer: 1,
          explain: 'Passing off AI-generated work as your own is plagiarism.',
        },
      ],
    },

    /* ------------------------------------------------------------ 3.3 */
    {
      id: 'privacy-deepfakes',
      title: 'Privacy, deepfakes & you',
      summary: 'Protect your data, spot synthetic media, and think about AI’s bigger footprint.',
      minutes: 10,
      sections: [
        {
          kind: 'text',
          heading: 'Your data is the product',
          body: [
            'Many AI services may save what you type and use it to improve their models, depending on the service and your settings. Read the privacy settings, and assume anything you type could be seen by others. Never share passwords, addresses, ID numbers, health details, or private information about friends.',
          ],
        },
        { kind: 'checkpoint', question: "An app’s privacy policy says chats “may be used to improve our services.” What does that most likely mean?", choices: ["Your chats could be stored, reviewed, or used for training", "Your chats are deleted instantly", "Nothing, it’s just legal words"], answer: 0, explain: "That phrase usually means your conversations can be kept and used, so don’t type anything private." },
        {
          kind: 'text',
          heading: 'Deepfakes and synthetic media',
          body: [
            'AI can now generate realistic fake images, audio, and video of real people. These are called deepfakes. They have been used for scams (like cloned voices asking family for money), misinformation, and harassment. Creating sexual or humiliating deepfakes of real people causes serious harm and is illegal in many places.',
          ],
        },
        {
          kind: 'list',
          heading: 'Check before you share',
          items: [
            { term: 'Pause', detail: 'Strong emotions like outrage, shock, or urgency are a signal to slow down.' },
            { term: 'Trace it', detail: 'Who posted it first? Do reliable news outlets report the same thing? A reverse image search can help.' },
            { term: 'Look for labels', detail: 'Some platforms and tools attach "AI-generated" labels or content credentials. Their absence doesn’t prove something is real.' },
            { term: 'Verify voices', detail: 'If a "family member" calls asking for money, hang up and call them back on a number you know.' },
          ],
        },
        {
          kind: 'callout',
          tone: 'fact',
          title: 'The bigger footprint',
          body: 'Training and running large AI models uses significant electricity and water for data centers. That’s one more reason to use AI purposefully rather than for everything.',
        },
      ],
      activity: {
        type: 'scenario',
        title: 'What would you do?',
        instructions: 'Choose the best response to each situation.',
        scenarios: [
          {
            situation: 'A classmate shares a shocking video of your principal "announcing" that school is cancelled for a week. It’s spreading fast.',
            options: [
              { text: 'Repost it right away. Everyone needs to know!', best: false, feedback: 'Sharing before verifying is how misinformation and deepfakes spread.' },
              { text: 'Check the school’s official website or channels before believing or sharing it.', best: true, feedback: 'Right. Go to the original, trusted source. Urgent, too-good-to-be-true content deserves extra checking.' },
              { text: 'Make your own AI video to reply.', best: false, feedback: 'Creating more synthetic media of a real person adds to the problem.' },
            ],
          },
          {
            situation: 'An AI homework app asks you to upload a photo of your student ID to "unlock premium features".',
            options: [
              { text: 'Upload it. It’s just a school ID.', best: false, feedback: 'IDs contain personal information that can be misused. Legit study tools rarely need it.' },
              { text: 'Don’t upload it. Check with a parent or teacher and review the app’s privacy policy first.', best: true, feedback: 'Yes. Protect identifying information and get a trusted adult’s opinion.' },
              { text: 'Upload a friend’s ID instead.', best: false, feedback: 'That shares someone else’s private data without permission.' },
            ],
          },
        ],
      },
      quiz: [
        {
          prompt: 'Which of these is safe to put into an AI chatbot?',
          choices: ['Your password', 'Your home address', 'A question about how volcanoes form', 'Your friend’s phone number'],
          answer: 2,
          explain: 'General learning questions are fine. Personal and private information is not.',
        },
        {
          prompt: 'A "deepfake" is…',
          choices: [
            'A very deep swimming pool',
            'AI-generated media that realistically imitates a real person',
            'A type of computer virus',
            'A secure password',
          ],
          answer: 1,
          explain: 'Deepfakes are synthetic images, audio, or video that imitate real people.',
        },
        {
          prompt: 'You get a panicked call from a voice that sounds like your cousin asking for gift cards. Best move?',
          choices: [
            'Buy the gift cards quickly',
            'Hang up and call your cousin back on a number you know',
            'Send your bank password',
            'Post about it before doing anything',
          ],
          answer: 1,
          explain: 'Voice cloning scams rely on urgency. Verifying through a known channel stops them.',
        },
      ],
    },
  ],
};
