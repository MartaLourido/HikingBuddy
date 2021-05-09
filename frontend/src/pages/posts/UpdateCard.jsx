import React, { useEffect } from "react";
import PostsApi from "../../api/PostsApi";
import { Button, Form } from "semantic-ui-react";

export default function UpdateCard({ onUpdateClick, onSubmite, post }) {
  const [postLocation, setPostLocation] = React.useState(post.postLocation);
  const [body, setBody] = React.useState(post.body);
  const [postDistance, setPostDistance] = React.useState(post.postDistance);

  const handleUpdate = (e) => {
    e.preventDefault();
    onUpdateClick({
      postLocation: postLocation,
      body: body,
      postDistance: postDistance,
    });
  };
  return (
    <div className="card mt-3">
      <div className="card-body">
        <Form>
          <Form.Field>
            <input
              className="form-control"
              placeholder="Håga Trail"
              value={postLocation}
              onChange={(e) => setPostLocation(e.target.value)}
            />
          </Form.Field>

          <Form.Field>
            <input
              className="form-control"
              placeholder="35"
              value={postDistance}
              onChange={(e) => setPostDistance(e.target.value)}
            />
          </Form.Field>

          <Form.Field>
            <input
              className="form-control"
              placeholder="I recommend because..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </Form.Field>
        </Form>

        <br></br>

        <Button
          as="a"
          inverted
          color="blue"
          onClick={handleUpdate}
          type="submit"
        >
          Submit change
        </Button>
      </div>
    </div>
  );
}
