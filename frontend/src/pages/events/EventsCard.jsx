import React, { useEffect, useState } from "react";

import EventsApi from "../../api/EventsApi";
import UpdateEvent from "./UpdateEvent";
import moment from "moment";
import {
  Button,
  Comment,
  Form,
  Header,
  Input,
  TextArea,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import EventCommentsApi from "../../api/EventCommentsApi";
import EventCommentCard from "../eventComments/EventCommentCard";
import EventCommentForm from "../eventComments/EventCommentForm";

export default function EventsCard({ event, onDeleteClick }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [eventComments, setEventComments] = useState([]);

  //Hooks for Event fields
  const [isNewTrailName, setNewTrailName] = useState(event.trailName);
  const [isNewEventDuration, setNewEventDuration] = useState(
    event.eventDuration
  );
  const [isNewEventDistance, setNewEventDistance] = useState(
    event.eventDistance
  );
  const [isNewEventDifficulty, setNewEventDifficulty] = useState(
    event.eventDifficulty
  );
  const [isNewMaxNum, setNewMaxNum] = useState(event.maxNum);
  const [isNewMeetPoint, setNewMeetPoint] = useState(event.meetPoint);
  const [isNewHyperlink, setNewHyperlink] = useState(event.trailHyperlink);
  const [isRefreshingBody, setRefreshingBody] = useState(event.body);

  async function createEventComment(eventCommentData) {
    try {
      const response = await EventCommentsApi.createEventComment(
        event.id,
        eventCommentData
      );
      const eventComment = response.data;
      const newEventComment = eventComments.concat(eventComment);

      setEventComments(newEventComment);
    } catch (e) {
      console.error(e);
    }
  }

  async function deleteEventComment(event) {
    try {
      await EventCommentsApi.deleteEventComment(event.id);
      const newEventComments = eventComments.filter((ev) => ev.id !== event.id);

      setEventComments(newEventComments);
    } catch (e) {
      console.error(e);
    }
  }

  async function updateEvent(eventToUpdate) {
    try {
      await EventsApi.updateEvent(event.id, eventToUpdate);
      EventsApi.getEventById(event.id)

        .then(({ data }) => {
          setNewTrailName(data.trailName);
          setNewEventDuration(data.eventDuration);
          setNewEventDistance(data.eventDistance);
          setNewEventDifficulty(data.eventDifficulty);
          setNewMaxNum(data.maxNum);
          setNewMeetPoint(data.meetPoint);
          setNewHyperlink(data.trailHyperlink);
          setRefreshingBody(data.body);
        })
        .catch((err) => console.error(err));
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    EventCommentsApi.getEventComments(event.id)
      .then(({ data }) => setEventComments(data))
      .catch((err) => console.error(err));
  }, [setEventComments]);

  // Components

  let filteredEventCommentList = eventComments.filter(
    (item) => item.commentedEvent == event.id
  );

  return (
    <Comment.Group>
      <Comment>
        <Comment.Avatar
          as="a"
          src="https://react.semantic-ui.com/images/avatar/small/steve.jpg"
        />
        <Comment.Content>
          <Comment.Author as="a"> {event.user}</Comment.Author>
          <Comment.Metadata>
            <div>{moment(event.createAt).format("DD/MM/YYYY hh:mm:ss A")}</div>
          </Comment.Metadata>

          <Comment.Text>{isNewTrailName}</Comment.Text>
          <Comment.Text>{isNewEventDuration}</Comment.Text>
          <Comment.Text>{isNewEventDistance}</Comment.Text>
          <Comment.Text>{isNewEventDifficulty}</Comment.Text>
          <Comment.Text>{isNewMaxNum}</Comment.Text>
          <Comment.Text>{isNewMeetPoint}</Comment.Text>
          <Comment.Text>{isNewHyperlink}</Comment.Text>
          <Comment.Text>{isRefreshingBody}</Comment.Text>

          <Comment.Actions>
            <Comment.Action active onClick={() => setIsUpdating(true)}>
              Edit event
            </Comment.Action>
            {event.user == event.user && (
              <Comment.Action onClick={onDeleteClick} active>
                {" "}
                Delete event
              </Comment.Action>
            )}
            {/* Buttons for share to social media  */}

            <FacebookShareButton
              url={window.location.href} //share the actual link of the post
              title={post.user} //the user who wrote the post
              description={postTitle} //the comment written in the post is shared
              quote="link"
            >
              <FacebookIcon className="mx-3" size={36} round />
            </FacebookShareButton>
            <TwitterShareButton
              url={window.location.href}
              title={postTitle} //the comment written in the post is shared
              quote="link"
              hashtag="hiking"
            >
              <TwitterIcon className="mx-3" size={36} round />
            </TwitterShareButton>
            <WhatsappShareButton
              url={window.location.href}
              separator=""
              title={postTitle} //the comment written in the post is shared
              quote="link"
            >
              <WhatsappIcon size={40} round={true} />
            </WhatsappShareButton>
            {/* Buttons for share to social media finish here  */}
          </Comment.Actions>

          <div className="comments-container">
            {eventComments &&
              filteredEventCommentList.map((eventComment) => (
                <EventCommentCard
                  key={event.id}
                  eventComment={eventComment}
                  onDeleteClick={() => deleteEventComment(eventComment)}
                />
              ))}
          </div>

          {isUpdating && (
            <UpdateEvent
              onUpdateClick={(eventData) => updateEvent(eventData)}
              event={event}
              onSubmite={() => setIsUpdating(false)}
            />
          )}

          <div className="comments-form">
            <EventCommentForm id={event.id} onSubmit={createEventComment} />
          </div>
        </Comment.Content>
      </Comment>
    </Comment.Group>
  );
}
