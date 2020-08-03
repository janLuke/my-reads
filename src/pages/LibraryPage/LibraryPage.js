import React  from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import './LibraryPage.scss';
import { Shelves } from "constants.js";
import { valuesOf } from "utils.js";
import Bookshelf from "components/Bookshelf";
import Scaffold from "components/Scaffold";
import Nav from "components/Nav";
import { Header, HeaderLayout } from 'components/Header';
import { IconButton } from "components/buttons/buttons";
import { ThemeSwitcher } from "components/utils";
import { scrollToElement } from "utils";

function scrollToShelf(shelf) {
  scrollToElement(
    document.getElementById(shelf.slug), {
      behavior: 'smooth',
      offset: -100
    });
}

function LibraryPageHeader() {
  return (
    <Header>
      <HeaderLayout>

        <div className="Library-logo-wrapper">
          <Header.Logo />
        </div>

        <Nav className="Library-nav">
          {Shelves.inDisplayOrder.map(shelf => (
            <Nav.Item key={shelf.id}>
              <a onClick={() => scrollToShelf(shelf)}>
                {shelf.shortDisplayName}
              </a>
            </Nav.Item>
          ))}
        </Nav>

        <div className="Library-action-items">
          <Link to="/search">
            <IconButton icon={faSearch} title="Search books" />
          </Link>
          <ThemeSwitcher />
        </div>

      </HeaderLayout>
    </Header>
  );
}

function groupBooksByShelf(books) {
  let byShelf = Object.fromEntries(
    Shelves.ids.map(id => [id, []]));
  for (let book of books)
    byShelf[book.shelf].push(book);
  return byShelf;
}

const LibraryPageBody = React.memo(({ booksByID }) => {
  let booksByShelfID = groupBooksByShelf(valuesOf(booksByID));
  return (
    <div className="Library-content">
      {Shelves.inDisplayOrder.map(shelf => (
        <Bookshelf
          id={shelf.slug}
          key={shelf.id}
          icon={shelf.icon}
          color={shelf.color}
          title={shelf.displayName}
          books={booksByShelfID[shelf.id]}
        />
      ))}
    </div>
  );
});

const LibraryPage = React.memo(({ booksByID, loading, error }) => {
  return (
    <Scaffold
      loading={loading}
      error={error}
      header={
        <LibraryPageHeader />
      }
      renderBody={
        () => <LibraryPageBody booksByID={booksByID} />
      }
    />
  );
});

LibraryPage.propTypes = {
  booksByID: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.object
};

LibraryPage.defaultProps = {
  loading: false,
  error: null
};

export default LibraryPage;