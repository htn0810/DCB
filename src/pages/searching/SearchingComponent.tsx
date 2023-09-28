import {
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import "./SearchingComponent.scss";
import { useState, useRef, useEffect } from "react";
import { Language, Search } from "@mui/icons-material";
import { hideIndicator, showIndicator } from "../../app/app.slice";
import { useAppDispatch } from "../../custom-hooks/hook";
import { ExternalApi } from "../../api/external.api";
import { showSidebar } from '../../app/sidebar.slice';
import { ORG_SELECTED } from '../../contants';

export default function SearchingComponent() {
  const [keyword, setKeyword] = useState<string>("");
  const [results, setResults] = useState([]);
  const [showNotFound, setShowNotFound] = useState<Boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>();
  const dispatch = useAppDispatch();

  const orgSelected = JSON.parse(localStorage.getItem(ORG_SELECTED)!);

  const getData = () => {
    if (keyword.trim() === "") return;
    dispatch(showIndicator());
    ExternalApi.getDataCoreSearch(keyword).then((res) => {
      setResults(res.data);
      dispatch(hideIndicator());
      if (res.data.length !== 0) {
        setShowNotFound(false);
      } else {
        setShowNotFound(true);
      }
    });
  };

  useEffect(() => {
    getData();
  }, [keyword]);

  useEffect(() => {
    dispatch(showSidebar());
  }, []);

  const handleSearch = (event: any) => {
    event.target.blur();
    if (inputRef.current) {
      if (inputRef.current.value.trim() === "") {
        setKeyword("");
        setResults([]);
        return null;
      }
      setKeyword(inputRef.current?.value);
    }
  };

  // use Regex to catch and highlight keyword in results
  const splitResult = (result: string) => {
    // If result has value, function will be passt next step and handle splitted to catch, return higlight keyword
    // Else it will be return null
    return result && result
      .split(new RegExp(`(${keyword})`, `gi`))
      .map((piece: string, index: number) => {
        return (
          <span
            key={index}
            style={{
              color:
                piece.toLowerCase() === keyword.toLocaleLowerCase()
                  ? "#007BC0"
                  : "",
              fontWeight:
                piece.toLowerCase() === keyword.toLocaleLowerCase()
                  ? "bold"
                  : "",
            }}
          >
            {piece}
          </span>
        );
      });
  };

  return (
    <section className={`search ${results.length > 0 ? "row" : ""}`}>
      {/* Toolbar */}
      <Toolbar className={`toolbar ${results.length > 0 ? "row" : ""}`}>
        <Typography variant="h5" style={{ flexGrow: 1 }}>
          Search Everything Here
        </Typography>
      </Toolbar>
      <h1 className={`search-greet ${results.length > 0 ? "hide" : ""}`}>Welcome to organization "{orgSelected?.name}"</h1>
      <h2 className={`search-title ${results.length > 0 ? "hide" : ""}`}>SEARCH</h2>
      <div ref={containerRef} className={`search-container ${results.length > 0 ? "remove" : ""} `}>
        {/* Search Bar */}
        <div className={`search-bar ${results.length > 0 ? "row" : ""}`}>
          <TextField
            inputRef={inputRef}
            className={`search-bar__input ${results.length > 0 ? "row" : ""}`}
            autoComplete="off"
            name="name"
            label="Type your keyword. . ."
            onKeyDown={(event) =>
              event.key === "Enter" ? handleSearch(event) : ""
            }
            InputProps={{
              endAdornment: (
                <InputAdornment className="search-bar__icon" position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <button
            onClick={handleSearch}
            className={`search-bar__btn ${results.length > 0 ? "row" : ""}`}
          >
            Search
          </button>
        </div>
        
        {/* Search Results */}
        {results.length > 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">No.</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="center">Website</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((item: any, index) => (
                <TableRow key={index + 1}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell sx={{ width: 180 }}>
                    {splitResult(item.objectType)}
                  </TableCell>
                  <TableCell>{splitResult(item.field)}</TableCell>
                  <TableCell align="center">
                    <a href={item.url} target="_blank" rel="noreferrer">
                      <Language className="website-icon" />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Search Not Found Results */}
      {showNotFound && keyword.trim() !== "" && (
        <div className="search-notfound">
          <div className="search-notfound__desc">
            Your search - <span>{keyword}</span> - did not match any documents!
          </div>
          <ul className="search-notfound__hint">
            Suggestions:
            <li>Make sure all words are spelled correctly</li>
            <li>Try different keywords</li>
            <li>Try more general keywords</li>
          </ul>
        </div>
      )}
    </section>
  );
}
