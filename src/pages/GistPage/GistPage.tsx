// lib
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Avatar, Typography } from "@mui/material";

// src
import Header from "../../components/common/Header/Header";
import { Section } from "../../styles/Section.style";
import Loader from "../../components/common/Loader/Loader";
import ViewFileContent from "../../components/common/ViewFileContent/ViewFileContent";
import StarWithCount from "../../components/common/StarWithCount/StarWithCount";
import ForkWithCount from "../../components/common/ForkWithCount/ForkWithCount";

// utils
import { showDateInDays } from "../../utils/GenericFunctions/GenericFunctions";

// style
import "./GistPage.css";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

const GistPage = () => {
  const { id } = useParams();
  const [gistData, setGistData] = useState<any>([]);
  const [loader, setLoader] = useState(true);
  const [searchState, setSearchState] = useState("");

  let user: any = localStorage.getItem("user");
  user = JSON.parse(user);

  useEffect(() => {
    fetch(`https://api.github.com/gists/${id}`)
      .then((response) => response.json())
      .then((result) => {
        console.log("gist result", result);
        setGistData([result]);
        console.log("gist result", result);
        setLoader(false);
      });
  }, []);

  const editSearchState = (e: any) => {
    setSearchState(e.target.value);
  };

  return (
    <>
      <Header editSearchState={editSearchState} searchState={searchState} />
      {loader && <Loader />}
      {!loader && (
        <Section>
          <div className="innerWrapper">
            <Grid container alignItems="center" className="pd-btm50">
              <Grid item lg={0.5}>
                <Avatar
                  src={gistData[0]?.owner?.avatar_url}
                  alt="User Profile"
                />
              </Grid>
              <Grid item lg={9.5}>
                <Typography color="blue">
                  {gistData[0]?.owner?.login}
                </Typography>
                <Typography style={{ color: "gray", fontSize: "14px" }}>
                  Created {showDateInDays(gistData[0]?.created_at)}{" "}
                </Typography>
                <p style={{ color: "gray", fontSize: "10px" }}>
                  Broadcast Server{" "}
                </p>
              </Grid>
              <Grid item lg={2}>
                <StarWithCount id={gistData[0]?.id} count={0} />
                <ForkWithCount
                  enable={
                    gistData[0]?.owner?.login === user?.login ? false : true
                  }
                  id={gistData[0]?.id}
                  count={0}
                />
              </Grid>
            </Grid>
            <Item>
              <Grid>
                <div className="gistContentWrapper">
                  <p>
                    {
                      gistData[0]?.files[Object.keys(gistData[0]?.files)[0]]
                        ?.filename
                    }
                  </p>
                  <hr></hr>
                  <ViewFileContent
                    file={
                      gistData[0].files[Object.keys(gistData[0]?.files)[0]]
                        ?.raw_url
                    }
                  />
                </div>
              </Grid>
            </Item>
          </div>
        </Section>
      )}
    </>
  );
};
export default GistPage;