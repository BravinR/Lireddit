import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import router, { useRouter } from 'next/router';
import React, { useState } from 'react'
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { MeDocument, MeQuery, useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';
import NextLink from 'next/link';
import { withApollo } from '../../utils/withApollo';


const ChangePassword: NextPage<{token: string}> = () => {
    const router = useRouter();
    console.log(router.query.token);
    const [changePassword] = useChangePasswordMutation();
    const [tokenError, setTokenError] = useState('');
    return (
    <Wrapper variant='small'> 
    <Formik
    initialValues ={{ newPassword:''}}
    onSubmit =  {async (values, {setErrors}) =>{
      const response = await changePassword({
        variables: {
          newPassword: values.newPassword,
          token:
            typeof router.query.token === "string"
              ? router.query.token
              : "",
        },
        update: (cache, { data }) => {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              __typename: "Query",
              me: data?.changePassword.user,
            },
          });
        },
      });
      
      if (response.data?.changePassword.errors){
        const errorMap = toErrorMap(response.data.changePassword.errors);
        if ('token' in errorMap){
          setTokenError(errorMap.token);
        }
        setErrors(errorMap);

      } else if (response.data?.changePassword.user){
        //worked
        router.push("/");
      }
    }} 
    >
      {({isSubmitting}) => (
        <Form>
          <InputField name="newPassword" placeholder= "new password" label="New Password" type="password"/>
          {tokenError ?(
            <Flex>
            
              <Box mr={2} color= 'red'>{tokenError}</Box>
              <NextLink href="/forgot-password">
                <Link>click here to get a new one</Link>
              </NextLink>
            </Flex>
          ) : null}
          <Button mt={4} type="submit" isLoading={isSubmitting} colorScheme="teal">Change Password</Button>
        </Form>
      )}
    </Formik>
    </Wrapper>
    );
}

export default withApollo({ssr:false})(ChangePassword);