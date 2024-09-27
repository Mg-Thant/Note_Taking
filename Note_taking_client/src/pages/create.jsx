import React from 'react';

import NoteForm from '../components/NoteForm';

const create = () => {
  return (
    <section className='px-10 mt-10 mb-5'>
        <NoteForm isCreate={true} />
    </section>
  )
}

export default create;
