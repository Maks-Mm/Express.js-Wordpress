// /wp-backend/routes/api/content.js

app.get("/api/content", async (req, res) => {
  try {
    const [wpResult, mongoResult] = await Promise.allSettled([
      fetchWordPressPosts(),
      fetchMongoNews()
    ]);

    const wpPosts = wpResult.status === "fulfilled"
      ? wpResult.value.map((item, index) => ({
          id: `wp-${item.id || index}`,
          title: { rendered: item.title.rendered },
          content: { rendered: item.content.rendered },
          excerpt: { rendered: item.excerpt.rendered },
          date: item.date,
          slug: item.slug,
          type: "wp",
          source: "WordPress",
          link: item.link
        }))
      : [];

    // 🧩 Here’s where your MongoDB mapping goes:
    const mongoNews = mongoResult.status === "fulfilled"
      ? mongoResult.value.map((item, index) => ({
          id: `mongo-${item._id || index}`,
          title: { rendered: item.title },
          content: { rendered: item.content || item.description || "" },
          excerpt: {
            rendered:
              item.description ||
              (item.content ? item.content.slice(0, 100) + "..." : "")
          },
          date: item.date || new Date().toISOString(), // ✅ date preserved
          slug: `mongo-${index}`,
          type: "news",
          source: item.source || "MongoDB",
          link: item.link || "#"
        }))
      : [];

    // Merge both content types
    const allContent = [...wpPosts, ...mongoNews].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    res.json(allContent);
  } catch (error) {
    console.error("Error combining content:", error);
    res.status(500).json({ error: "Failed to combine content" });
  }
});
