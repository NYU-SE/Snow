from dao.models import Flake, User, Image
from django.test import TestCase
from django.contrib.auth.models import User as AuthUser

class UserTestCase(TestCase):
    def setUp(self):
        auth_user1 = AuthUser.objects.create_user(
            email = "test1@demo.com",
            username = "test1",
            password = "test_password_123"
        )
        self.test_user1 = User.objects.create(
            auth = auth_user1,
            nickname = "test_user1"
        )
        auth_user2 = AuthUser.objects.create_user(
            email = "test2@demo.com",
            username = "test2",
            password = "test_password_123"
        )
        self.test_user2 = User.objects.create(
            auth = auth_user2,
            nickname = "test_user2"
        )

    def test_post_flake(self):
        self.test_user1.post_flake(content="hello test!")
        flake = Flake.objects.get(author=self.test_user1)
        self.assertEqual(flake.content, "hello test!")
        self.assertEqual(flake.author, self.test_user1)

    def test_delete_own_flake(self):
        self.test_user1.post_flake(content="hello test!")
        flake = Flake.objects.get(author=self.test_user1)
        self.assertEqual(flake.content, "hello test!")
        self.test_user1.delete_flake(flake)
        with self.assertRaises(Flake.DoesNotExist):
            Flake.objects.get(author=self.test_user1)

    def test_delete_others_flake(self):
        self.test_user1.post_flake(content="hello test!")
        flake = Flake.objects.get(author=self.test_user1)
        self.test_user2.delete_flake(flake)
        flake = Flake.objects.get(author=self.test_user1)
        self.assertEqual(flake.content, "hello test!")
        self.assertEqual(flake.author, self.test_user1)

    def test_like(self):
        self.test_user1.post_flake(content="hello test!")
        flake = Flake.objects.get(author=self.test_user1)
        self.assertEqual(len(flake.get_likes()), 0)

        self.test_user2.like(flake)
        likes = flake.get_likes()
        self.assertEqual(len(likes), 1)
        self.assertEqual(likes[0].user, self.test_user2)
        self.assertEqual(likes[0].flake, flake)

        self.test_user2.unlike(flake)
        self.assertEqual(len(flake.get_likes()), 0)

    def test_follow(self):
        self.assertEqual(len(self.test_user1.get_follows()), 0)
        self.assertEqual(len(self.test_user1.get_followers()), 0)
        self.assertEqual(len(self.test_user2.get_follows()), 0)
        self.assertEqual(len(self.test_user2.get_followers()), 0)

        self.test_user1.follow(self.test_user2)

        self.assertEqual(len(self.test_user1.get_follows()), 1)
        self.assertEqual(len(self.test_user1.get_followers()), 0)
        self.assertIn(self.test_user2, self.test_user1.get_follows())

        self.assertEqual(len(self.test_user2.get_follows()), 0)
        self.assertEqual(len(self.test_user2.get_followers()), 1)
        self.assertIn(self.test_user1, self.test_user2.get_followers())

        self.test_user1.unfollow(self.test_user2)

        self.assertEqual(len(self.test_user1.get_follows()), 0)
        self.assertEqual(len(self.test_user1.get_followers()), 0)
        self.assertEqual(len(self.test_user2.get_follows()), 0)
        self.assertEqual(len(self.test_user2.get_followers()), 0)

    def test_list_flakes(self):
        self.test_user1.post_flake(content="foo")
        self.test_user1.post_flake(content="bar")
        flakes = self.test_user1.list_flakes()
        self.assertEqual(len(flakes), 2)
        self.assertEqual(len(self.test_user2.list_flakes()), 0)
        self.assertTrue(all(map(lambda f: f.author == self.test_user1, flakes)))
        self.assertTrue(any(map(lambda f: f.content == "foo", flakes)))
        self.assertTrue(any(map(lambda f: f.content == "bar", flakes)))

    def test_feeds(self):
        self.test_user1.post_flake(content="foo")
        self.test_user2.post_flake(content="bar")
        self.test_user1.follow(self.test_user2)
        self.test_user2.post_flake(content="baz")
        feeds1 = self.test_user1.get_feeds()
        feeds2 = self.test_user2.get_feeds()
        self.assertEqual(len(feeds1), 3)
        self.assertEqual(len(list(filter(lambda f: f.author == self.test_user1, feeds1))), 1)
        self.assertEqual(len(list(filter(lambda f: f.author == self.test_user2, feeds1))), 2)
        self.assertEqual(len(feeds2), 2)
        self.assertTrue(all(map(lambda f: f.author == self.test_user2, feeds2)))
