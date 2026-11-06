type Questions = ReadonlyArray<readonly [question: string, answer: string]>;

export function faqSchema(questions: Questions) {
  return {
    '@type': 'FAQPage',
    mainEntity: questions.map(([name, text]) => ({
      '@type': 'Question',
      name,
      acceptedAnswer: { '@type': 'Answer', text },
    })),
  };
}

export function ContentFaq({ questions }: { questions: Questions }) {
  return (
    <div className="faq-list">
      {questions.map(([question, answer]) => (
        <details key={question}>
          <summary>{question}</summary>
          <p>{answer}</p>
        </details>
      ))}
    </div>
  );
}
