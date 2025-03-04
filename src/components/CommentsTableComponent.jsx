import React, { useEffect } from "react";
import { useAdComments } from "../context/AdCommentContext";

const CommentsTableComponent = ({ adId }) => {
  const { comments, loading, error, fetchCommentsForAd } = useAdComments();

  useEffect(() => {
    fetchCommentsForAd(adId);
  }, []);

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h3>Comments</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => (
            <tr key={comment._id}>
              <td>{comment.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommentsTableComponent;
