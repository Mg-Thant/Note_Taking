import React from 'react';

import NoteForm from '../components/NoteForm';

const edit = () => {
  return (
    <section className='px-10 mt-10 mb-5'>
        <NoteForm isCreate={false} />
    </section>
  )
}

export default edit;
