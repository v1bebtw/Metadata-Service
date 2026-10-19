function DocumentStats({ stats }) {
  return (
    <div className="stats">
      <article>
        <small>Всего</small>
        <strong>{stats.total}</strong>
      </article>
      <article>
        <small>PDF</small>
        <strong>{stats.pdf}</strong>
      </article>
      <article>
        <small>DOCX</small>
        <strong>{stats.docx}</strong>
      </article>
      <article>
        <small>IMAGE</small>
        <strong>{stats.image}</strong>
      </article>
    </div>
  );
}

export default DocumentStats;
