import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, redirect, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getContact, updateContact } from "../data";

export const action = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
};

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ contact });
};

export default function EditContact() {
  const { contact } = useLoaderData<typeof loader>();

  return (
    <Form key={contact.id} id="contact-form" method="post">
      <p>
        <span>名前</span>
        <input
          defaultValue={contact.first}
          aria-label="ファーストネーム"
          name="first"
          type="text"
          placeholder="First"
        />
        <input
          aria-label="ラストネーム"
          defaultValue={contact.last}
          name="last"
          placeholder="Last"
          type="text"
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          defaultValue={contact.twitter}
          name="twitter"
          placeholder="@jack"
          type="text"
        />
      </label>
      <label>
        <span>アバターURL</span>
        <input
          aria-label="アバターURL"
          defaultValue={contact.avatar}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <label>
        <span>メモ</span>
        <textarea
          defaultValue={contact.notes}
          name="notes"
          rows={6}
        />
      </label>
      <p>
        <button type="submit">保存</button>
        <button type="button" onClick={() => {
          return redirect('/');
        }}>キャンセル</button>
      </p>
    </Form>
  );
}