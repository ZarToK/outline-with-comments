import { CheckmarkIcon, TrashIcon } from "outline-icons";
import React, { useState, useEffect, Fragment } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Comment } from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";
import List from "~/components/List";
import Item from "~/components/List/Item";
import useCurrentUser from "~/hooks/useCurrentUser";
import Button from "./Button";
import Comments from "./Comments";
import InputSearch from "./InputSearch";

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
  const [searchTerm, setSearchTerm] = useState("");
  const user = useCurrentUser();
  const history = useHistory();

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

  function deleteQuestion(discussionId: any) {
    const requestOptions = {
      method: "DELETE",
    };
    fetch("/api/discussion/question/" + discussionId, requestOptions);
    history.push("/questions");
  }

  const filteredDiscussions = discussions.filter((discussion) =>
    stripHtmlTags(
      discussion.text + discussion.children.map((child) => child.text).join(" ")
    )
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (params.id !== undefined) {
    return (
      <div>
        {showComponent && user.isAdmin && (
          <Button
            onClick={() => {
              answerQuestion(params.id);
            }}
          >
            Mark as answered
          </Button>
        )}
        &nbsp;&nbsp;
        {showComponent && user.isAdmin && (
          <Button
            onClick={() => {
              deleteQuestion(params.id);
            }}
          >
            <TrashIcon size={15} /> Delete
          </Button>
        )}
        <Comments id={params.id}></Comments>
      </div>
    );
  }

  function stripHtmlTags(html: string): string {
    return html.replace(/<[^>]*>/g, "");
  }

  return (
    <div>
      <Button
        onClick={() => {
          {
            history.push("/questions/Q-" + uuidv4());
          }
        }}
      >
        New question
      </Button>
      <br />
      <br />
      <InputSearch
        type="text"
        value={searchTerm}
        placeholder="Search . . ."
        onChange={(event: {
          target: { value: React.SetStateAction<string> };
        }) => setSearchTerm(event.target.value)}
      />
      <br />
      <List>
        {filteredDiscussions.map((discussion) => (
          <Item
            key={discussion.discussionId}
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
