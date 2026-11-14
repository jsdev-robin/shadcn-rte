import { useState } from 'react';
import { RichTextEditor, RichTextViewer } from './package/editor';

const App = () => {
  const [content, setContent] = useState('');

  return (
    <div className="p-10">
      <RichTextEditor
        value={content}
        onChange={setContent}
        placeholder="Type Here"
        minHeight={300}
      />
      <br />
      <br />
      <RichTextViewer value={content} />
    </div>
  );
};

export default App;
