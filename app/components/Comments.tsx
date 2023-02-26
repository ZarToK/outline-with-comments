import React, { useEffect, useState } from "react";
import { CommentSection } from "react-comments-section";
import mdcRippleCss from "react-comments-section/dist/index.css";
import useCurrentUser from "~/hooks/useCurrentUser";
import useStores from "~/hooks/useStores";

mdcRippleCss; // hack - if removed the comment css will be removed by webpack production optimization

type Props = {
  id: string;
};

const Comments = (props: Props) => {
  const user = useCurrentUser();
  const discussionId = props.id;
  const { users } = useStores();
  const [data, _setData] = useState([]);

  const setData = (data: any) => {
    data.forEach((item: any) => {
      item.comId = item.commentId;
      users.all.forEach((userItem) => {
        if (userItem.id === item.userId) {
          item.avatarUrl = userItem.avatarUrl;
          item.fullName = userItem.name;
        }
      });
    });
    _setData(data);
  };

  const fetchData = () => {
    return fetch("/api/discussion/" + discussionId)
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
          .then((data) => this.setState({ postId: data.commentId }));
      }}
      onReplyAction={(data: {
        userId: string;
        comId: string;
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
      currentData={(data: any) => {
        console.log(data);
      }}
    />
  );
};

export default Comments;
