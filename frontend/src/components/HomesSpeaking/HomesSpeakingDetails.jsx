import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./HomesSpeakingDetails.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer"

const API_URL = "http://localhost:5000/api/homes-speaking";
const SERVER_URL = "http://localhost:5000";

const HomesSpeakingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [home, setHome] = useState(null);
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);

const [commentForm, setCommentForm] = useState({
  name: "",
  email: "",
  message: "",
});

const [commentLoading, setCommentLoading] = useState(false);

  // ==========================================
  // IMAGE URL
  // ==========================================
  const getImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:image")
    ) {
      return image;
    }

    if (image.startsWith("/uploads/")) {
      return `${SERVER_URL}${image}`;
    }

    if (image.startsWith("uploads/")) {
      return `${SERVER_URL}/${image}`;
    }

    if (image.startsWith("/")) {
      return image;
    }

    return `${SERVER_URL}/${image}`;
  };

  // ==========================================
  // FETCH ALL HOMES


  // ==========================================
// FETCH ARTICLE + COMMENTS
// ==========================================
useEffect(() => {
  const fetchArticleAndComments = async () => {
    try {
      setLoading(true);
      setError("");

      // ============================
      // 1. FETCH HOMES SPEAKING
      // ============================
      const response = await fetch(API_URL);
      const result = await response.json();

      console.log("Homes Speaking API:", result);

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch Homes Speaking"
        );
      }

      const data = Array.isArray(result.data)
        ? result.data
        : [];

      setHomes(data);

      // Find current article
      const selectedHome = data.find(
        (item) => String(item.id) === String(id)
      );

      if (!selectedHome) {
        setHome(null);
        setError("Article not found.");
        setLoading(false);
        return;
      }

      setHome(selectedHome);

      // ============================
      // 2. FETCH COMMENTS
      // ============================
      try {
        const commentResponse = await fetch(
          `http://localhost:5000/api/home-comments/${id}`
        );

        const commentResult = await commentResponse.json();

        console.log("Comments API:", commentResult);

        if (
          commentResponse.ok &&
          commentResult.success
        ) {
          setComments(
            Array.isArray(commentResult.data)
              ? commentResult.data
              : []
          );
        } else {
          setComments([]);
        }
      } catch (commentError) {
        console.error(
          "Comments Fetch Error:",
          commentError
        );

        // Article should still load even if comments API fails
        setComments([]);
      }
    } catch (error) {
      console.error(
        "Homes Speaking API Error:",
        error
      );

      setHome(null);
      setError(
        error.message || "Unable to load article."
      );
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    fetchArticleAndComments();
  }
}, [id]);


const handleCommentChange = (e) => {
  const { name, value } = e.target;

  setCommentForm((previous) => ({
    ...previous,
    [name]: value,
  }));
};


const handleCommentSubmit = async (e) => {
  e.preventDefault();

  if (
    !commentForm.name.trim() ||
    !commentForm.email.trim() ||
    !commentForm.message.trim()
  ) {
    alert("Please fill all fields.");
    return;
  }

  try {
    setCommentLoading(true);

    const response = await fetch(
      "http://localhost:5000/api/home-comments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          homeId: id,
          name: commentForm.name,
          email: commentForm.email,
          message: commentForm.message,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Failed to post comment"
      );
    }

    // Add new comment immediately
    setComments((previous) => [
      result.data,
      ...previous,
    ]);

    // Clear form
    setCommentForm({
      name: "",
      email: "",
      message: "",
    });

    alert("Comment posted successfully.");
  } catch (error) {
    console.error(
      "Comment Submit Error:",
      error
    );

    alert(
      error.message ||
        "Failed to post comment."
    );
  } finally {
    setCommentLoading(false);
  }
};

  // ==========================================
  // RELATED ARTICLES
  // ==========================================
  const relatedHomes = useMemo(() => {
    return homes
      .filter((item) => String(item.id) !== String(id))
      .slice(0, 2);
  }, [homes, id]);

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="homes-details-loading">
        <div className="homes-details-loader"></div>
        <p>Loading article...</p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (error || !home) {
    return (
      <div className="homes-details-error">
        <h2>{error || "Article not found."}</h2>

        <button
          type="button"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  const tags = Array.isArray(home.tags)
    ? home.tags
    : [];

  return (

    <>
    <Navbar/>
     <main className="homes-details-page">

      {/* ==================================================
          HERO
      ================================================== */}
      <section className="homes-details-hero">

        <img
          className="homes-details-hero-image"
          src={getImageUrl(home.image)}
          alt={home.title || "Home"}
        />

        <div className="homes-details-hero-overlay"></div>

        <div className="homes-details-hero-content">

          {/* BACK */}
          <button
            type="button"
            className="homes-details-back"
            onClick={() => navigate("/")}
          >
            <span>←</span>
            Back to Home
          </button>

          {/* META */}
          <div className="homes-details-hero-meta">

            <span className="homes-details-featured">
              Featured
            </span>

            <span>
              <strong>Category:</strong>{" "}
              {home.category || "realestate"}
            </span>

            <span>
              <strong>Date:</strong>{" "}
              {home.date || "N/A"}
            </span>

          </div>

          {/* TITLE */}
          <h1>
            {home.title}
          </h1>

          {/* DESCRIPTION */}
          <p>
            {home.description}
          </p>

        </div>
      </section>

      {/* ==================================================
          ARTICLE INFO BAR
      ================================================== */}
      <section className="homes-details-info-bar">

        <div className="homes-details-info-inner">

          <strong className="homes-details-author">
            {home.author || "WorkDo"}
          </strong>

          <span>
            <strong>Category:</strong>{" "}
            {home.category || "realestate"}
          </span>

          <span>
            <strong>Date:</strong>{" "}
            {home.date || "N/A"}
          </span>

          <button
            type="button"
            className="homes-details-share"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  window.location.href
                );
                alert("Link copied!");
              } catch (error) {
                console.error(error);
              }
            }}
          >
            ↗ Share
          </button>

        </div>
      </section>

      {/* ==================================================
          ARTICLE BODY
      ================================================== */}
      <section className="homes-details-content">

        <div className="homes-details-main">

          {/* TITLE */}
          <div className="homes-details-small-meta">
            <strong>{home.author || "WorkDo"}</strong>

            <span>
              Category:{" "}
              <b>{home.category || "realestate"}</b>
            </span>

            <span>
              Date:{" "}
              <b>{home.date || "N/A"}</b>
            </span>

            <span
              className="homes-details-small-share"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(
                    window.location.href
                  );
                  alert("Link copied!");
                } catch (error) {
                  console.error(error);
                }
              }}
            >
              ↗ Share
            </span>
          </div>

          {/* ARTICLE TITLE */}
          <h2 className="homes-details-article-title">
            {home.title}
          </h2>

          {/* MAIN IMAGE */}
          <div className="homes-details-main-image">
            <img
              src={getImageUrl(home.image)}
              alt={home.title}
            />
          </div>

          {/* DESCRIPTION */}
          {home.description && (
            <p className="homes-details-paragraph">
              {home.description}
            </p>
          )}

          {/* DETAILED DESCRIPTION */}
          {home.detailedDescription && (
            <div className="homes-details-rich-text">
              {home.detailedDescription
                .split("\n")
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index}>
                    {paragraph}
                  </p>
                ))}
            </div>
          )}

          {/* ADDITIONAL DESCRIPTION */}
          {home.additionalDescription && (
            <div className="homes-details-rich-text">
              {home.additionalDescription
                .split("\n")
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index}>
                    {paragraph}
                  </p>
                ))}
            </div>
          )}

          {/* QUOTE */}
          {home.quote && (
            <blockquote className="homes-details-quote">
              <span className="homes-details-quote-mark">
                “
              </span>

              <p>{home.quote}</p>
            </blockquote>
          )}

          {/* TAGS */}
          {tags.length > 0 && (
            <div className="homes-details-tags">
              <strong>Tags:</strong>

              {tags.map((tag, index) => (
                <span key={index}>
                  {tag}
                </span>
              ))}
            </div>
          )}

        </div>

        {/* ==================================================
            RELATED ARTICLES
        ================================================== */}
        <aside className="homes-details-sidebar">

          <h3>
            Related articles
          </h3>

          {relatedHomes.map((related) => (
            <article
              className="homes-related-card"
              key={related.id}
            >

              <div className="homes-related-image">
                <img
                  src={getImageUrl(related.image)}
                  alt={related.title}
                />

                <span>
                  {related.category || "realestate"}
                </span>
              </div>

              <div className="homes-related-body">

                <div className="homes-related-meta">
                  {related.date || "N/A"} |{" "}
                  {related.author || "WorkDo"}
                </div>

                <h4>
                  {related.title}
                </h4>

                <p>
                  {related.description}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/homes-speaking/${related.id}`
                    )
                  }
                >
                  Show full details
                  <span>→</span>
                </button>

              </div>

            </article>
          ))}

          {relatedHomes.length === 0 && (
            <p className="homes-no-related">
              No related articles.
            </p>
          )}

          {/* COMMENTS UI */}
    <div className="homes-comments">

  <h3>
    {comments.length}{" "}
    {comments.length === 1
      ? "comment"
      : "comments"}
  </h3>

  {/* =====================================
      EXISTING COMMENTS
  ====================================== */}
  {comments.length > 0 && (
    <div className="homes-comments-list">

      {comments.map((comment) => (
        <div
          className="homes-comment-item"
          key={comment._id}
        >

          <div className="homes-comment-avatar">
            {comment.name
              ?.charAt(0)
              .toUpperCase()}
          </div>

          <div className="homes-comment-content">

            <div className="homes-comment-top">

              <strong>
                {comment.name}
              </strong>

              <span>
                {new Date(
                  comment.createdAt
                ).toLocaleDateString()}
              </span>

            </div>

            <p>
              {comment.message}
            </p>

          </div>

        </div>
      ))}

    </div>
  )}

  {comments.length === 0 && (
    <p className="homes-no-comments">
      No comments yet.
    </p>
  )}

  {/* =====================================
      COMMENT FORM
  ====================================== */}
  <form
    className="homes-comment-form"
    onSubmit={handleCommentSubmit}
  >

    <h4>
      Leave a Comment
    </h4>

    <input
      type="text"
      name="name"
      value={commentForm.name}
      onChange={handleCommentChange}
      placeholder="Name"
      required
    />

    <input
      type="email"
      name="email"
      value={commentForm.email}
      onChange={handleCommentChange}
      placeholder="Email"
      required
    />

    <textarea
      name="message"
      value={commentForm.message}
      onChange={handleCommentChange}
      placeholder="Message"
      rows="4"
      required
    />

    <button
      type="submit"
      disabled={commentLoading}
    >
      {commentLoading
        ? "Posting..."
        : "Post Comment"}
    </button>

  </form>

</div>

        </aside>

      </section>

    </main>

    <Footer/>
    </>
   
  );
};

export default HomesSpeakingDetails;