"use client";

// Thin client wrapper so <details>/<summary> toggle doesn't cause a
// hydration mismatch. All content is passed as children from the server.
export default function TopicCardDetails({ children }) {
    return (
        <details className="topicCard">
            {children}
        </details>
    );
}
