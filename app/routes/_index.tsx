import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useActionData, useLoaderData, useNavigate } from '@remix-run/react'
import { useEffect } from 'react'

import { userPrefs } from '~/cookies.server'
import { readConfig } from '~/config.server'

export const meta: MetaFunction = () => {
  return [
    { title: 'EpicJira' },
    { name: 'description', content: 'Welcome to EpicJira!' },
  ]
}

export const loader = async ({
  request,
  params,
  context,
}: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await userPrefs.parse(cookieHeader)) || {}

  const config = await readConfig()

  return json({ dashboards: config.dashboards, cookie })
}

export const action = async ({
  request,
  params,
  context,
}: ActionFunctionArgs) => {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await userPrefs.parse(cookieHeader)) || {}
  const bodyParams = await request.formData()
  if (bodyParams.get('bannerVisibility') === 'hidden') {
    cookie.showBanner = false
  }
  return redirect('/', {
    headers: {
      'Set-Cookie': await userPrefs.serialize(cookie),
    },
  })
}

export default function Index() {
  const { dashboards, cookie } = useLoaderData<typeof loader>()
  const {} = useActionData<typeof action>() ?? {}
  const navigate = useNavigate()

  useEffect(() => navigate('/dashboard'), [])

  return null
}
