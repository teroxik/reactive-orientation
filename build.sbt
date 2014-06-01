name := "reactive-orientation"

version := "1.0-SNAPSHOT"

scalaVersion := "2.11.1"

libraryDependencies ++= Seq(
  "org.scalaz" %% "scalaz-core" % "7.0.6"
)

emberJsVersion := "1.5.1"

lazy val root = (project in file(".")).enablePlugins(PlayScala)