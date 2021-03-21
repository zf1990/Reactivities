import React from "react";
import { Message } from "semantic-ui-react";

interface IProps {
  errors: string[] | null;
}

export default function ValidationErrors(prop: IProps) {
  const { errors } = prop;
  return (
    <Message error>
      {errors && (
        <Message.List>
          {errors.map((err: any, key) => (
            <Message.Item key={key}>{err}</Message.Item>
          ))}
        </Message.List>
      )}
    </Message>
  );
}
