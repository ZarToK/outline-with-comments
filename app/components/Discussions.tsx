import { createLocation, LocationDescriptor } from "history";
import { CheckmarkIcon } from "outline-icons";
import React, { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import { Comment } from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import List from "~/components/List";
import Item from "~/components/List/Item";
import Button from "./Button";
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
  const endpoint =
    window.location.hostname !== "wiki.sqlsystems.se"
      ? "/test-data/discussion-data.json"
      : "/api/discussion/questions/all";

  useEffect(() => {
    fetch(endpoint)
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

  const [showComponent, setShowComponent] = useState(true);

  function answerQuestion(discussionId: any) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        discussionId,
        answer: true,
      }).replace(/[\u007F-\uFFFF]/g, function (chr) {
        return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
      }),
    };
    fetch(
      "/api/discussion/question/" + discussionId + "/answer",
      requestOptions
    );
    setShowComponent(false);
  }

  if (params.id !== undefined) {
    return (
      <div>
        {showComponent && (
          <Button
            onClick={() => {
              answerQuestion(params.id);
            }}
          >
            Mark as answered
          </Button>
        )}
        <Comments id={params.id}></Comments>
      </div>
    );
  }
  const location: LocationDescriptor = createLocation(
    "/questions/Q-" + uuidv4()
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
