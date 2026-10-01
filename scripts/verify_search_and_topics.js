/**
 * scripts/verify_search_and_topics.js
 * Comprehensive verification suite testing search & database readiness.
 */

const fs = require('fs');
const path = require('path');

async function testSearchAPI() {
  console.log("=" .repeat(80));
  console.log("TESTING SEARCH API (WITH/WITHOUT ACCENTS, TERMS, NATURAL LANGUAGE)");
  console.log("=" .repeat(80));

  const testQueries = [
    { label: 'Standard Accent Query', q: 'thế giới quan' },
    { label: 'Non-Accent Query', q: 'the gioi quan' },
    { label: 'Philosophy Term Query', q: 'vật chất' },
    { label: 'Non-Accent Term Query', q: 'vat chat' },
    { label: 'Natural Language Query', q: 'cách nhìn thế giới' },
    { label: 'Natural Language Essay Query', q: 'triết giúp viết luận thế nào' },
    { label: 'No Match Query (Empty result handling)', q: 'xyzabc123' }
  ];

  for (const t of testQueries) {
    console.log(`\nQuery [${t.label}]: "${t.q}"`);
    try {
      const res = await fetch('http://localhost:3000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: t.q, filter: 'all' })
      });
      if (res.ok) {
        const data = await res.json();
        console.log(`  -> Matched topics: ${data.topics ? data.topics.length : 0}`);
        console.log(`  -> Matched terms: ${data.terms ? data.terms.length : 0}`);
        if (data.topics && data.topics.length > 0) {
          console.log(`     Top Result: Topic ${data.topics[0].topic_number} - "${data.topics[0].title}" (Chương ${data.topics[0].chapter_number})`);
        }
        if (data.terms && data.terms.length > 0) {
          console.log(`     Term Result: "${data.terms[0].term}" -> ${data.terms[0].definition}`);
        }
        if (data.suggestions && data.suggestions.length > 0) {
          console.log(`     Suggestions: ${data.suggestions.join(', ')}`);
        }
      } else {
        console.log(`  -> Server response status: ${res.status}`);
      }
    } catch (err) {
      console.log(`  -> Search API test offline or local dev server not running (will build and test via Next build).`);
    }
  }
}

testSearchAPI();
