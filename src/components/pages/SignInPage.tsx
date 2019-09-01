import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Form, Text } from "react-form";
import styled from "styled-components";
import { Panel, Button } from "~/components/atoms";
import { MQ_S } from "~/styles/mediaquery";
import { useUser, useRouter } from "~/stores/hooks";
import { FormItemContainer } from "~/components/atoms";

/**
 * ログインページ
 */
export const SignInPage: React.FC = () => {
  const { isAuthenticated, isFetching, login } = useUser();
  const { goto } = useRouter();

  useEffect(() => {
    function redirectToDashboardIfNeeded(isAuthenticated: boolean) {
      if (shouldRedirectToDashBoard(isAuthenticated)) {
        goto("transportation");
      }
    }
    redirectToDashboardIfNeeded(isAuthenticated);
  }, [goto, isAuthenticated]);

  if (isFetching) {
    return <p>Fetching...</p>;
  }

  return (
    <Root className="app-content-full">
      <Helmet>
        <title>Sign In | TMS</title>
      </Helmet>
      <LoginMain>
        <h1>Sign in to TMS</h1>
        <p>
          Enter your <strong>user name</strong> and <strong>password</strong>.
        </p>
        <Form onSubmit={handleSubmit}>
          {formApi => (
            <Panel>
              <form onSubmit={formApi.submitForm}>
                {/* User name text filed */}
                <FormItemContainer>
                  <Text
                    field={"username"}
                    id={"username"}
                    placeholder="John Doe"
                    maxLength={30}
                    required={true}
                  />
                  <label htmlFor={"username"}>UserName</label>
                </FormItemContainer>
                {/* Password text field */}
                <FormItemContainer>
                  <Text
                    type="password"
                    field={"password"}
                    id={"password"}
                    placeholder="Your password"
                    maxLength={30}
                    required={true}
                  />
                  <label htmlFor={"password"}>Password</label>
                </FormItemContainer>
                <Button variant="contained" color="primary" block>
                  Sign in
                </Button>
              </form>
            </Panel>
          )}
        </Form>
      </LoginMain>
    </Root>
  );

  function shouldRedirectToDashBoard(isAuthenticated: boolean): boolean {
    return isAuthenticated;
  }

  function handleSubmit({ username = "", password = "" }) {
    login(username, password);
  }
};

const Root = styled.main`
  align-self: center;
  justify-self: center;
`;

const LoginMain = styled.div`
  width: 95%;
  align-self: center;
  justify-self: center;

  & > * {
    text-align: center;
  }

  ${MQ_S} {
    width: 550px;
  }
`;
