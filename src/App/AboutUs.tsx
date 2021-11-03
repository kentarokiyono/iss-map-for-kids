import React from "react";
import Markdown from 'markdown-to-jsx';
import './AboutUs.scss'

type Props = {
  data: string | undefined;
}

const Content = (props: Props) => {

  const [ content, setContent ] = React.useState<string>('')

  React.useEffect(() => {
    if (!props.data) {
      return
    }

    fetch(props.data)
    .then((response) => {
      return response.ok ? response.text() : Promise.reject(response.status);
    })
    .then((data) => {
      setContent(data)
    });
  }, [props.data])

  return (
    <div className="about-us">
      <div className="container">
        <Markdown>{content}</Markdown>
      </div>
    </div>
  );
};

export default Content;
