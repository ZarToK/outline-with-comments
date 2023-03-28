import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Comment } from "sequelize-typescript";
import List from "~/components/List";
import Item from "~/components/List/Item";
import Comments from "./Comments";

interface Comment {
  userId: string;
  commentId: string;
  text: string;
  children: Comment[];
  answer?: boolean;
}

interface Discussion {
  userId: string;
  commentId: string;
  text: string;
  children: Comment[];
  answer?: boolean;
}

interface UrlParams {
  id?: string;
}

const DiscussionBoard: React.FC = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);

  // Get ID from URL
  const params = useParams<UrlParams>();

  useEffect(() => {
    fetch("/test-data/discussion-data.json")
      .then((response) => response.json())
      .then((data) => {
        const discussionsData = data.map((discussionData: any) => {
          const firstComment = discussionData[0];
          const discussion: Discussion = {
            userId: firstComment.userId,
            commentId: firstComment.commentId,
            text: firstComment.text,
            children: firstComment.children,
            answer: firstComment.answer,
          };
          return discussion;
        });
        setDiscussions(discussionsData);
      })
      .catch((error) => console.error(error));
  }, []);

  if (params.id !== undefined) {
    return <Comments id={params.id}></Comments>;
  }

  /*

  const handleAnswerClick = (discussionIndex: number, commentIndex: number) => {
    const updatedDiscussions = discussions.map((discussion, index) => {
      if (index !== discussionIndex) {
        return discussion;
      }
      const updatedComments = discussion.children.map((comment, commentIndexToUpdate) => {
        const isAnswer = commentIndex === commentIndexToUpdate;
        return {
          ...comment,
          answer: isAnswer
        };
      });
      return {
        ...discussion,
        children: updatedComments
      };
    });
    setDiscussions(updatedDiscussions);
  };
  */

  return (
    <List>
      {discussions.map((discussion) => (
        <Item
          title={discussion.text}
          to={"/questions/" + discussion.commentId}
          small={false}
          border={true}
        ></Item>
      ))}
    </List>
  );
  /*
return (
{
  discussions.map((discussion, discussionIndex) => (

      {discussion.children.map((comment, commentIndex) => (
        <div key={comment.commentId}>
          <p>{comment.text}</p>
          <button onClick={() => handleAnswerClick(discussionIndex, commentIndex)}>Mark as Answer</button>
          {comment.answer && <p>Answered</p>}
        </div>
      ))}
  ))
}
)*/
};

export default DiscussionBoard;
