function Footer() {
  return (
    <footer
      style={{
        marginTop: "50px",
        padding: "20px",
        borderTop: "1px solid #ccc",
      }}
    >
      <p>© 2026 MonSite</p>

      <div>
        <a href="/cgu">CGU</a> |{" "}
        <a href="/mentions-legales">Mentions légales</a> |{" "}
        <a href="/contact">Contact</a>
      </div>
    </footer>
  );
}

export default Footer;
