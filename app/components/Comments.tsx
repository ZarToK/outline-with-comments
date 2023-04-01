import React, { useEffect, useState } from "react";
import { CommentSection } from "react-comments-section";
import mdcRippleCss from "react-comments-section/dist/index.css";
import useCurrentUser from "~/hooks/useCurrentUser";

mdcRippleCss; // hack - if removed the comment css will be removed by webpack production optimization

type Props = {
  id: string;
};

const Comments = (props: Props) => {
  const user = useCurrentUser();
  const discussionId = props.id;
  const [data, _setData] = useState([]);

  const setData = (data: any) => {
    data.forEach((item: any) => {
      item.comId = item.commentId;
      item.replies = item.children;
      item.replies.forEach((item2: any) => {
        item2.comId = item2.commentId;
        item2.replies = item2.children;
        item2.replies.forEach((item3: any) => {
          item3.comId = item3.commentId;
          item3.replies = item3.children;
        });
      });
    });
    _setData(data);
  };

  const endpoint =
    window.location.hostname !== "wiki.sqlsystems.se"
      ? "/test-data/comment-data.json"
      : "/api/discussion/" + discussionId;

  const fetchData = () => {
    return fetch(endpoint)
      .then((response) => response.json())
      .then((data) => setData(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <CommentSection
      currentUser={{
        currentUserId: user.id,
        currentUserImg: user.avatarUrl,
        currentUserProfile: "",
        currentUserFullName: user.name,
      }}
      logIn={{
        loginLink: "",
        signupLink: "",
      }}
      hrStyle={{ border: "1px solid #B57167" }}
      titleStyle={{ color: "#B57167" }}
      inputStyle={{ border: "1px solid rgb(208 208 208)" }}
      formStyle={{ backgroundColor: "transparent" }}
      submitBtnStyle={{
        border: "1px solid #405F59",
        backgroundColor: "#405F59",
      }}
      cancelBtnStyle={{
        border: "1px solid gray",
        backgroundColor: "gray",
        color: "white",
      }}
      advancedInput={true}
      commentData={data}
      onSubmitAction={(data: {
        userId: string;
        comId: string;
        text: string;
        fullName: string;
        avatarUrl: string;
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
          .then((data) => this.setState({ postId: data.commentId }));
      }}
      onReplyAction={(data: {
        userId: string;
        comId: string;
        fullName: string;
        avatarUrl: string;
        parentOfRepliedCommentId: string;
        repliedToCommentId: string;
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
          .then((data) => this.setState({ postId: data.commentId }));
      }}
      onDeleteAction={(data: { comIdToDelete: string }) => {
        const requestOptions = {
          method: "DELETE",
        };
        fetch("/api/discussion/comment/" + data.comIdToDelete, requestOptions);
      }}
      onEditAction={(data: { comId: string; text: string }) => {
        const requestOptions = {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data).replace(/[\u007F-\uFFFF]/g, function (
            chr
          ) {
            return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
          }),
        };
        fetch("/api/discussion/comment/" + data.comId, requestOptions);
      }}
      currentData={(data: any) => {
        console.log(data);
      }}
    />
  );
};

export default Comments;
