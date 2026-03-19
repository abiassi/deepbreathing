export function JsonLd<T>({ data }: { data: T }) {
  // Render each schema as its own script tag to avoid browser/extension
  // parsing issues with bare JSON-LD arrays
  if (Array.isArray(data)) {
    return (
      <>
        {data.map((item, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(item)
            }}
          />
        ))}
      </>
    );
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data)
      }}
    />
  );
}
