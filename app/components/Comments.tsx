import React from "react";
import { CommentSection } from "react-comments-section";
import mdcRippleCss from "react-comments-section/dist/index.css";
import useCurrentUser from "~/hooks/useCurrentUser";

mdcRippleCss; // hack

type Props = {
  id: string;
};

const Comments = (props: Props) => {
  const user = useCurrentUser();
  const discussionId = props.id;

  const data = [
    {
      userId: "02b",
      comId: "017",
      fullName: "Lily",
      userProfile: "https://www.linkedin.com/in/riya-negi-8879631a9/",
      text: "I think you have a point🤔",
      avatarUrl: "https://ui-avatars.com/api/name=Lily&background=random",
      replies: [],
    },
  ];
  return (
    <CommentSection
      currentUser={{
        currentUserId: user.id,
        currentUserImg: user.avatarUrl,
        currentUserProfile: "",
        currentUserFullName: user.name,
      }}
      inputStyle={{ color: "black" }}
      commentData={data}
      onSubmitAction={(data: {
        userId: string;
        comId: string;
        text: string;
      }) => {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data).replace(/[\u007F-\uFFFF]/g, function (
            chr
          ) {
            return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
          }),
        };
        fetch("/api/discussion/" + discussionId, requestOptions)
          .then((response) => response.json())
          .then((data) => this.setState({ postId: data.id }));
      }}
      onReplyAction={(data: {
        userId: string;
        parentOfRepliedCommentId: string;
        repliedToCommentId: string;
        text: string;
      }) => console.log("check submit, ", data)}
      currentData={(data: any) => {
        console.log("curent data", data);
      }}
    />
  );
};

export default Comments;
