import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { ReviewCard } from "../../src/components/client/reviews/review-card";
import { getInitials } from "../../src/components/client/reviews/review-utils";

test("review initials use the first and last displayed name parts", () => {
  assert.equal(getInitials("Samira Alaoui"), "SA");
  assert.equal(getInitials("Samira El Alaoui"), "SA");
  assert.equal(getInitials("  Samira   Alaoui  "), "SA");
  assert.equal(getInitials("Samira"), "S");
});

test("review cards retain five stars and render initials in the avatar slot", () => {
  const html = renderToStaticMarkup(
    createElement(ReviewCard, {
      name: "Samira Alaoui",
      company: "INFO-L@N customer",
      comment: "A practical local service.",
      rating: 5,
      ratingLabel: "Five out of five",
      imageAlt: "Samira Alaoui",
    }),
  );

  assert.equal((html.match(/\blucide-star\b/g) ?? []).length, 5);
  assert.match(html, /data-slot="avatar"/);
  assert.match(html, />SA</);
  assert.doesNotMatch(html, /<img/);
});
