import { createLocation, LocationDescriptor } from "history";
import { CheckmarkIcon } from "outline-icons";
import React, { useState, useEffect, Fragment } from "react";
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
  discussionId: string;
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
    fetch("/api/discussion/questions/all")
      .then((response) => response.json())
      .then((data) => {
        const discussionsData = data.map((discussionData: any) => {
          const discussion: Discussion = {
            discussionId: discussionData.discussionId,
            userId: discussionData.userId,
            commentId: discussionData.commentId,
            text: discussionData.text,
            children: discussionData.children,
            answer: discussionData.answer,
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

  function generateUUID(): string {
    let uuid = "";
    for (let i = 0; i < 32; i++) {
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += "-";
      }
      const random = Math.floor(Math.random() * 16);
      if (i === 12) {
        uuid += "4";
      } else if (i === 16) {
        uuid += (random & 3) | 8;
      } else {
        uuid += random.toString(16);
      }
    }
    return uuid;
  }

  const location: LocationDescriptor = createLocation(
    "/questions/Q-" + generateUUID()
  );

  function stripHtmlTags(html: string): string {
    return html.replace(/<[^>]*>/g, "");
  }

  return (
    <div>
      <a href={location.pathname}>New question</a>
      <List>
        {discussions.map((discussion) => (
          <Item
            title={
              <Fragment>
                <CheckmarkIcon
                  color={discussion.answer ? "green" : "grey"}
                  size={22}
                />{" "}
                {stripHtmlTags(discussion.text).substring(0, 80)}
              </Fragment>
            }
            subtitle={
              <Fragment>
                {stripHtmlTags(discussion.text).substring(80, 400)}
              </Fragment>
            }
            to={"/questions/" + discussion.discussionId}
            small={false}
            border={true}
          ></Item>
        ))}
      </List>
    </div>
  );
};

export default DiscussionBoard;
