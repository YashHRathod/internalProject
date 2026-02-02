import Footer from "./Footer/Footer";
import Header from "./Header/Header";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header><Header/></header>
      <main>{children}</main>
      <footer><Footer/></footer>
    </div>
  );
};

export default Layout;

